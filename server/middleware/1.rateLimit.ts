// 限制速度
interface RateLimit {
  count: number
  timestamp: number
}

export default defineEventHandler( async (event) => {
  if (getRequestURL(event).pathname.startsWith('/api/')) { 

  

  const storage = useStorage()
  const now = Date.now()
  const ip = getRequestHeader(event, 'x-forwarded-for')?.split(',')[0] 
  || getRequestHeader(event, 'x-real-ip')
  || event.node.req.socket.remoteAddress
  || 'unknown'

  const minute = Math.floor(Date.now() / 60000)
  const key = `rate-limit:${ip}:${minute}`
  // console.log('Request headers:', event.node.req.headers)
  console.log(`key`, key)
  // 获取当前分钟的请求次数
  const limit = await storage.getItem<RateLimit>(key) || { count: 0, timestamp: 0 }

  // 如果记录不存在或已过期，创建新记录
  if (!limit || (now - limit.timestamp) >= 60000) {
    await storage.setItem(key, {
      count: 1,
      timestamp: now
    })
    return
  }
  console.log(`request times => `, limit.count)
  // 设置限制：每分钟 10 次
  if (+limit.count >= 10) {
    throw createError({
      statusCode: 429,
      message: '请求过于频繁，请稍后再试'
    })
  }

  // 增加计数并设置过期时间
  // 更新计数 
  await storage.setItem(key, {
    count: limit.count + 1,
    timestamp: limit.timestamp
  })
}
})