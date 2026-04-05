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

function getNowKST() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000)
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

      // 만료 시간 체크
      if (banner && banner.expiresAt) {
        const now = getNowKST().getTime()
        const expires = new Date(banner.expiresAt).getTime()
        if (now >= expires) {
          await db.del('banner:current')
          const history = await db.lrange('banner:history', 0, 19)
          return res.status(200).json({
            banner: null,
            history: history.map(h => JSON.parse(h)),
          })
        }
      }

      const history = await db.lrange('banner:history', 0, 19)
      return res.status(200).json({
        banner: banner && banner.message ? banner : null,
        history: history.map(h => JSON.parse(h)),
      })
    }

    // POST: 배너 설정
    if (req.method === 'POST') {
      const { message, showRefresh, expireMinutes, expireAt } = req.body || {}
      if (!message) return res.status(400).json({ error: 'message required' })

      const now = getNowKST()
      const timestamp = now.toISOString().slice(0, 19).replace('T', ' ')

      // 만료 시간 계산
      let expiresAt = ''
      let expiresLabel = ''
      if (expireMinutes && expireMinutes > 0) {
        const exp = new Date(now.getTime() + expireMinutes * 60 * 1000)
        expiresAt = exp.toISOString()
        expiresLabel = exp.toISOString().slice(0, 19).replace('T', ' ')
      } else if (expireAt) {
        // KST 시각을 ISO로 변환 (입력이 KST 기준)
        const exp = new Date(expireAt + ':00.000Z')
        // expireAt은 이미 KST이므로 UTC로 저장 시 -9시간
        const expUTC = new Date(exp.getTime() - 9 * 60 * 60 * 1000)
        expiresAt = new Date(expUTC.getTime() + 9 * 60 * 60 * 1000).toISOString()
        expiresLabel = expireAt.replace('T', ' ')
      }

      await db.hset('banner:current',
        'message', message,
        'timestamp', timestamp,
        'showRefresh', showRefresh ? '1' : '0',
        'expiresAt', expiresAt,
        'expiresLabel', expiresLabel
      )

      // 이력에 추가 (최대 20개 유지)
      const historyEntry = { message, timestamp }
      if (expiresLabel) historyEntry.expires = expiresLabel
      await db.lpush('banner:history', JSON.stringify(historyEntry))
      await db.ltrim('banner:history', 0, 19)

      return res.status(200).json({ ok: true, message, timestamp, expiresLabel })
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
