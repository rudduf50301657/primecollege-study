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

const PAGES = ['home', 'statistics']

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  try {
    const db = getRedis()
    await db.connect().catch(() => {})

    const now = new Date(Date.now() + 9 * 60 * 60 * 1000)
    const today = now.toISOString().slice(0, 10)

    // 전체 통계
    const visitors = await db.scard(`visitors:${today}`) || 0
    const views = parseInt(await db.get(`views:${today}`)) || 0
    const totalVisitors = await db.scard('visitors:total') || 0
    const totalViews = parseInt(await db.get('views:total')) || 0

    // 페이지별 통계
    const pages = {}
    for (const page of PAGES) {
      pages[page] = {
        visitors: await db.scard(`visitors:${today}:${page}`) || 0,
        views: parseInt(await db.get(`views:${today}:${page}`)) || 0,
        totalVisitors: await db.scard(`visitors:total:${page}`) || 0,
        totalViews: parseInt(await db.get(`views:total:${page}`)) || 0,
      }
    }

    return res.status(200).json({
      today, visitors, views, totalVisitors, totalViews, pages
    })
  } catch (err) {
    console.error('Stats error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
}
