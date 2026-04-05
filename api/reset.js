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
  try {
    const db = getRedis()
    await db.connect().catch(() => {})

    // 모든 키 삭제
    const keys = await db.keys('*')
    if (keys.length > 0) {
      await db.del(...keys)
    }

    return res.status(200).json({ deleted: keys.length, keys })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
