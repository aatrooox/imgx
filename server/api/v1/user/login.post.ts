import * as jose from 'jose'
import prisma from '@@/lib/prisma'
// 登录接口, 获取jwt token
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // 将此key加入到payload中 请求时校验有无此key及user信息
  const { nuxtSecretKey, jwtSecret, cookie } = useRuntimeConfig(event)
  const { username, password } = body
  const secret = new TextEncoder().encode(jwtSecret)
  const user = await prisma.user.findUnique({
    where: {
      username
    }
  })

  if (!user) {
    throw createError({
      statusCode: 400,
      message: '用户不存在'
    })
  }

  if (user.password !== password) {
    throw createError({
      status: 400,
      statusText: '账号或密码错误'
    })
  }

  const isProd = process.env.NODE_ENV === 'production'
  const payload = {
    userId: user.id,
    role: user.role,
  }

  // console.log(`login-payload`, payload)
  const token = await new jose.SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('30d').sign(secret)
  
  setCookie(event, 'token', token, {
    httpOnly: true,
    sameSite: 'lax', // strict lax none
    maxAge: 2592000, // maxAge 优先级高， expires 受客户端时间的影响
    secure: true,
    domain: isProd ? '.zzao.club' : 'localhost',
  })
  
  return {
    data: {
      token,
      user
    },
    msg: '登录成功'
  }
})