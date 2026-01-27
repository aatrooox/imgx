import { generateImage } from '~/server/utils/image'
import { renderErrorSvg } from '~/server/utils/satori'
import { z } from 'zod'
import { getPresetByCode } from '~/server/utils/preset'
import { normalizeStyleProps } from '~/server/utils/paramNormalizer'

/**
 * POST endpoint for generating images with JSON body
 * 
 * Usage:
 * POST /:presetCode
 * Content-Type: application/json
 * 
 * Body:
 * {
 *   // Content props (based on preset's contentKeys)
 *   "title": "My Title",
 *   "subtitle": "My Subtitle",
 *   
 *   // Style props (any props not in contentKeys)
 *   "titleColor": "#ffffff",
 *   "bgColor": "#1e40af",
 *   
 *   // Optional parameters
 *   "format": "png",      // "svg" or "png" (default: "png")
 *   "download": false     // true to download, false for display (default: false)
 * }
 * 
 * Example:
 * curl -X POST https://imgx.zzao.club/006 \
 *   -H "Content-Type: application/json" \
 *   -d '{"title":"Hello","subtitle":"World","format":"png"}' \
 *   --output image.png
 */

// Define request body schema
const PostBodySchema = z.object({
  format: z.enum(['svg', 'png']).optional().default('png'),
  download: z.boolean().optional().default(false),
}).catchall(z.any()) // Allow additional properties for content and style props

export default defineEventHandler(async (event) => {
  const presetCode = getRouterParam(event, 'presetCode')
  
  console.log('[Route POST] ========== Request Start ==========')
  console.log('[Route POST] presetCode:', presetCode)
  
  // Validate and parse request body
  const bodyResult = await useSafeValidatedBody(event, PostBodySchema)
  
  if (!bodyResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (bodyResult as any).message ?? '参数错误'
    })
  }
  
  const body = bodyResult.data
  const format = body.format
  const download = body.download
  
  console.log('[Route POST] body:', body)
  console.log('[Route POST] format:', format)
  console.log('[Route POST] download:', download)

  // Get preset
  const preset = await getPresetByCode(presetCode!)

  if (!preset) {
    setHeader(event, 'Content-Type', 'image/svg+xml')
    setHeader(event, 'Cache-Control', 'public, max-age=3600, immutable')
    
    const svg = await renderErrorSvg('Preset not found', { width: 300, height: 100 })
    return svg
  }
  
  const contentKeys = preset?.contentKeys || ''
  const propsSchema = preset?.propsSchema || []

  console.log('[Route POST] contentKeys:', contentKeys)
  console.log('[Route POST] propsSchema:', propsSchema)

  // Separate content props and style props from body
  const contentKeysArray = contentKeys.split(',').map((k: string) => k.trim()).filter((k: string) => k)
  
  const customContentProps: Record<string, any> = {}
  const customStyleProps: Record<string, any> = {}
  
  // Exclude format and download from props
  const { format: _, download: __, ...props } = body
  
  console.log('[Route POST] props to process:', props)
  
  // Classify props as content or style based on contentKeys
  for (const key in props) {
    if (contentKeysArray.includes(key)) {
      customContentProps[key] = props[key]
      console.log('[Route POST] Mapped as content prop:', key, '=', props[key])
    } else {
      // Collect raw style props (will be normalized later)
      customStyleProps[key] = props[key]
      console.log('[Route POST] Mapped as style prop:', key, '=', props[key])
    }
  }
  
  // Normalize style props (handle arrays, colors, sizes, etc.)
  const normalizedStyleProps = normalizeStyleProps(customStyleProps, propsSchema)
  
  console.log('[Route POST] customContentProps:', customContentProps)
  console.log('[Route POST] customStyleProps (raw):', customStyleProps)
  console.log('[Route POST] normalizedStyleProps:', normalizedStyleProps)
  console.log('[Route POST] Calling generateImage...')

  try {
    const image = await generateImage({
      preset,
      customContentProps,
      customStyleProps: normalizedStyleProps,
      format
    })
    
    console.log('[Route POST] Image generated successfully')
    console.log('[Route POST] ========== Request End ==========')

    setHeader(event, 'Content-Type', format === 'svg' ? 'image/svg+xml' : 'image/png')
    setHeader(event, 'Cache-Control', 'public, max-age=3600, immutable')
    
    if (download) {
      setHeader(event, 'Content-Disposition', `attachment; filename="imgx-${presetCode}-${new Date().getTime()}.${format}"`)
    }
    
    // Generate ETag for caching (based on body content)
    const etag = `"${Buffer.from(JSON.stringify(body)).toString('base64')}"`
    setHeader(event, 'ETag', etag)
    setHeader(event, 'Last-Modified', new Date().toUTCString())

    // Check client cache
    const ifNoneMatch = getRequestHeader(event, 'if-none-match')
    if (ifNoneMatch === etag) {
      event.node.res.statusCode = 304
      return null
    }

    return image
  } catch (error) {
    console.error('[Route POST] ERROR generating image:', error)
    console.log('[Route POST] ========== Request End (Error) ==========')
    throw error
  }
})
