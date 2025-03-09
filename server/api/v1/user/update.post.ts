import prisma from "@@/lib/prisma"

// email        String?       @unique
//   nickname     String?
//   avatar_url   String?
// 更新用户信息，只允许改这三个
export default defineEventHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    id: z.string(),
    email: z.string().optional(),
    nickname: z.string().optional(),
    avatar_url: z.string().optional(),
  }))
  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error)
    })
  }
  
  if(Object.keys(body.data).length === 1) { 
    throw createError({
      statusCode: 400,
      message: '没有需要更新的字段'
    })
  }
 
  const updateUser = await prisma.user.update({
    where: {
      id: body.data.id
    },
    data: {
      email: body.data.email,
      nickname: body.data.nickname,
      avatar_url: body.data.avatar_url,
    }
  })


  return {
    data: updateUser,
    message: 'ok'
  }
})
