import prisma from '~/lib/prisma'
import { generateImage } from '~/server/utils/image'
import { renderErrorSvg } from '~/server/utils/satori'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const text = decodeURI(getRouterParam(event, 'text') || '')
  const presetCode = getRouterParam(event, 'presetCode')
  
  const query = await useSafeValidatedQuery(event, z.object({}).catchall(z.string()))
  const format = (query.data?.format as 'svg' | 'png') || 'png'
  const download = query.data?.download === '1'
  
  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (query as any).message ?? 'Invalid parameters'
    })
  }
  
  const contents = text.split('/')
  const customStyleProps: Record<string, any> = { ...query.data }
  delete customStyleProps.format
  delete customStyleProps.download

  const preset = await prisma.preset.findUnique({
    where: {
      code: presetCode
    },
    include: {
      templateInfo: {
        select: {
          contentKeys: true,
          propsSchema: true,
          template: true
        }
      }
    }
  })

  if (!preset) {
    setHeader(event, 'Content-Type', 'image/svg+xml')
    setHeader(event, 'Cache-Control', 'public, max-age=3600, immutable')
    
    const svg = await renderErrorSvg('Preset not found', { width: 300, height: 100 })
    return svg
  }
  
  const { contentKeys, propsSchema } = preset.templateInfo

  // Process custom content props
  const customContentProps: Record<string, string> = {}
  const contentKeysArray = contentKeys.split(',')
  contents.forEach((value: string, index: number) => {
    if (contentKeysArray[index]) {
      customContentProps[contentKeysArray[index]] = value
    }
  })
  
  // Process custom style props (convert size types to numbers)
  for (const key in customStyleProps) {
    const schemaItem = (propsSchema as any[]).find((item: any) => item.key === key)
    if (customStyleProps[key]) {
      customStyleProps[key] = schemaItem?.type === 'size' ? parseInt(customStyleProps[key]) : customStyleProps[key]
    }
  }

  const image = await generateImage({
    preset,
    customContentProps,
    customStyleProps,
    format
  })

  setHeader(event, 'Content-Type', format === 'svg' ? 'image/svg+xml' : 'image/png')
  setHeader(event, 'Cache-Control', 'public, max-age=3600, immutable')
  if (download) {
    setHeader(event, 'Content-Disposition', `attachment; filename="imgx-${presetCode}-${new Date().getTime()}.${format}"`)
  }
  
  // Generate ETag for caching
  const etag = `"${Buffer.from(JSON.stringify(getQuery(event))).toString('base64')}"`
  setHeader(event, 'ETag', etag)
  setHeader(event, 'Last-Modified', new Date().toUTCString())

  // Check client cache
  const ifNoneMatch = getRequestHeader(event, 'if-none-match')
  if (ifNoneMatch === etag) {
    event.node.res.statusCode = 304
    return null
  }

  return image
})
