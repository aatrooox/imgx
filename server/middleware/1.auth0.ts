import * as jose from 'jose'
import getWhiteRoutes from '../utils/whiteRoutes'
// 校验有无权限 jwt 
export default defineEventHandler(async (event) => {
  // api/v1 开头的接口需要校验token
  // POST请求需要校验， GET放过
  if (getRequestURL(event).pathname.startsWith('/api/v1') && event.node.req.method !== 'GET') {
    // 排除掉登录和注册
    if (!getWhiteRoutes().includes(getRequestURL(event).pathname)) {
      const { jwtSecret } = useRuntimeConfig(event)
      // const auth_token = getRequestHeader(event, 'Authorization')
      const token = getCookie(event, 'token')
      // 如果没有token, 需要先登录
      if (!token) { 
        // console.log(`无token`, )
        throw createError({
          statusCode: 403,
          message: '请先登录',
        })
      }
      const secret = new TextEncoder().encode(jwtSecret)
      // 校验token是否有效
      const { payload } = await jose.jwtVerify(token, secret).catch( err => {
        console.log(`jose err`, err)
        throw createError({
          statusCode: 401,
          message: '登录已过期，请重新登录',
        })
      })

         // 有人拿到了token, 前端重新部署后更新了nuxtkey
        // if (payload.nuxtKey !== nuxtSecretKey) {
        //   console.log(`payload ---- `, payload, payload.nuxtKey, nuxtSecretKey)
        //   throw createError({
        //     statusCode: 401,
        //     message: '博客有更新，请重新登录',
        //   })

        // }
       // 把权限和用户id存到上下文中
       event.context.userId = payload.userId
       event.context.userRole = payload.role

       console.log(`auth0 - token - success - ${getRequestURL(event).pathname}`)
      }
    }
  } 
)