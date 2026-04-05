import Redis from 'ioredis'

let redis

function getRedis() {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
      lazyConnect: true,
    })
  }
  return redis
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const db = getRedis()
    await db.connect().catch(() => {})

    // GET: 현재 배너 조회
    if (req.method === 'GET') {
      const banner = await db.hgetall('banner:current')
      const history = await db.lrange('banner:history', 0, 19)
      return res.status(200).json({
        banner: banner && banner.message ? banner : null,
        history: history.map(h => JSON.parse(h)),
      })
    }

    // POST: 배너 설정
    if (req.method === 'POST') {
      const { message } = req.body || {}
      if (!message) return res.status(400).json({ error: 'message required' })

      const now = new Date(Date.now() + 9 * 60 * 60 * 1000)
      const timestamp = now.toISOString().slice(0, 19).replace('T', ' ')

      // 현재 배너 설정
      await db.hset('banner:current', 'message', message, 'timestamp', timestamp)

      // 이력에 추가 (최대 20개 유지)
      await db.lpush('banner:history', JSON.stringify({ message, timestamp }))
      await db.ltrim('banner:history', 0, 19)

      return res.status(200).json({ ok: true, message, timestamp })
    }

    // DELETE: 배너 제거
    if (req.method === 'DELETE') {
      await db.del('banner:current')
      return res.status(200).json({ ok: true })
    }

    return res.status(405).json({ error: 'method not allowed' })
  } catch (err) {
    console.error('Banner error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
}
