import { getPresetByCode } from '~/server/utils/preset'
import { generateImage } from '~/server/utils/image'
import { renderErrorSvg } from '~/server/utils/satori'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const presetCode = getRouterParam(event, 'presetCode')
  const query = await useSafeValidatedQuery(event, z.object({ format: z.enum(['svg', 'png']).optional() }))
  const format = query.data?.format || 'png'
  
  // Parse and validate scale parameter
  const scaleRaw = getQuery(event).scale
  const scale = scaleRaw ? parseFloat(scaleRaw as string) : 1
  if (isNaN(scale) || scale < 0.5 || scale > 5) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid scale parameter. Must be between 0.5 and 5.' })
  }
  
  const preset = await getPresetByCode(presetCode!)
  
  if (!preset) {
    setHeader(event, 'Content-Type', 'image/svg+xml')
    setHeader(event, 'Cache-Control', 'public, max-age=3600, immutable')
    const svg = await renderErrorSvg('Preset not found', { width: 300, height: 100 })
    return svg
  }
  
  const image = await generateImage({ preset, format, scale })
  
  setHeader(event, 'Content-Type', format === 'svg' ? 'image/svg+xml' : 'image/png')
  setHeader(event, 'Cache-Control', 'public, max-age=3600, immutable')
  
  const etag = `"${Buffer.from(JSON.stringify({ preset: preset.code, format, scale })).toString('base64')}"`
  setHeader(event, 'ETag', etag)
  
  const ifNoneMatch = getRequestHeader(event, 'if-none-match')
  if (ifNoneMatch === etag) {
    event.node.res.statusCode = 304
    return null
  }
  
  return image
})
