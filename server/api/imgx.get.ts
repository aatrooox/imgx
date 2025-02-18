import { getSafeComponentProps } from '~/lib/params';
import { imgGenerateSchame } from '~/lib/schema'
// TODO 验证参数格式化 临时使用
export default defineEventHandler(async (event) => {
  const query = await useSafeValidatedQuery(event, imgGenerateSchame)

  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (query as any).message ?? '参数错误'
    })
  }

  const params = query.data;
  console.log(`params`, params)
  const safeProps = getSafeComponentProps(params)

  return safeProps
})