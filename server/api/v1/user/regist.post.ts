import prisma from "@@/lib/prisma"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  let role = 'user'
  // 前端校验合法性
  const { email, password, username } = body

  // 获取用户数
  const count = await prisma.user.count();
  // 第一个注册的用户为管理员
  if (count === 0) {
    role = 'superAdmin'
  } 

  const _user = await prisma.user.findUnique({
    where: {
      username
    }
  })

  if (_user) { 
    throw createError({
      statusCode: 400,
      message: '用户名已存在'
    })
  }
  // 创建新用户
  const user = await prisma.user.create({
    data: {
      username,
      password,
      email,
      role,
    }
  })

  return {
    data: user,
    message: '注册成功',
  }
})