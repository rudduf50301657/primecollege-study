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
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const db = getRedis()
    await db.connect().catch(() => {})

    // 한국 시간 기준 오늘 날짜
    const now = new Date(Date.now() + 9 * 60 * 60 * 1000)
    const today = now.toISOString().slice(0, 10)

    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
      || req.headers['x-real-ip']
      || 'unknown'

    const viewsKey = `views:${today}`
    const visitorsKey = `visitors:${today}`

    // 조회수 +1 (매 요청마다)
    const views = await db.incr(viewsKey)

    // 고유 방문자 (IP 기반, 중복 무시)
    await db.sadd(visitorsKey, ip)
    const visitors = await db.scard(visitorsKey)

    // 48시간 후 자동 삭제
    await db.expire(viewsKey, 172800)
    await db.expire(visitorsKey, 172800)

    return res.status(200).json({ visitors, views, today })
  } catch (err) {
    console.error('Visitor tracking error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
}
