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

    const page = req.query.page || 'unknown'

    // 한국 시간 기준 오늘 날짜
    const now = new Date(Date.now() + 9 * 60 * 60 * 1000)
    const today = now.toISOString().slice(0, 10)

    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
      || req.headers['x-real-ip']
      || 'unknown'

    // 전체 (오늘)
    const views = await db.incr(`views:${today}`)
    await db.sadd(`visitors:${today}`, ip)
    const visitors = await db.scard(`visitors:${today}`)

    // 전체 (누적)
    const totalViews = await db.incr('views:total')
    await db.sadd('visitors:total', ip)
    const totalVisitors = await db.scard('visitors:total')

    // 페이지별 (오늘)
    const pageViews = await db.incr(`views:${today}:${page}`)
    await db.sadd(`visitors:${today}:${page}`, ip)
    const pageVisitors = await db.scard(`visitors:${today}:${page}`)

    // 페이지별 (누적)
    const pageTotalViews = await db.incr(`views:total:${page}`)
    await db.sadd(`visitors:total:${page}`, ip)
    const pageTotalVisitors = await db.scard(`visitors:total:${page}`)

    // 오늘 키 48시간 후 자동 삭제
    await db.expire(`views:${today}`, 172800)
    await db.expire(`visitors:${today}`, 172800)
    await db.expire(`views:${today}:${page}`, 172800)
    await db.expire(`visitors:${today}:${page}`, 172800)

    return res.status(200).json({
      today,
      visitors, views, totalVisitors, totalViews,
      pageVisitors, pageViews, pageTotalVisitors, pageTotalViews,
    })
  } catch (err) {
    console.error('Visitor tracking error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
}
