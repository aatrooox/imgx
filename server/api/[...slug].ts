export default defineEventHandler(async (event) => {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not Found',
  })
})