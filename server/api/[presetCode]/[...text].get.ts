import { generateImage } from '~/server/utils/image'
import { renderErrorSvg } from '~/server/utils/satori'
import { z } from 'zod'
import { getPresetByCode } from '~/server/utils/preset'
import { getParsedText } from '~/lib/content'
import { normalizeStyleProps } from '~/server/utils/paramNormalizer'

export default defineEventHandler(async (event) => {
  const text = decodeURI(getRouterParam(event, 'text') || '')
  const presetCode = getRouterParam(event, 'presetCode')
  
  console.log('[Route] ========== Request Start ==========')
  console.log('[Route] presetCode:', presetCode)
  console.log('[Route] text:', text)
  
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

  console.log('[Route] contents:', contents)
  console.log('[Route] query params:', query.data)

  const preset = await getPresetByCode(presetCode!)

  if (!preset) {
    setHeader(event, 'Content-Type', 'image/svg+xml')
    setHeader(event, 'Cache-Control', 'public, max-age=3600, immutable')
    
    const svg = await renderErrorSvg('Preset not found', { width: 300, height: 100 })
    return svg
  }
  
  const contentKeys = preset?.contentKeys || ''
  const propsSchema = preset?.propsSchema || []

  console.log('[Route] contentKeys:', contentKeys)
  console.log('[Route] propsSchema:', propsSchema)

  // Process custom content props
  const customContentProps: Record<string, string> = {}
  const contentKeysArray = contentKeys.split(',')
  
  console.log('[Route] contentKeysArray:', contentKeysArray)
  
  if (contentKeysArray.length === 1 && contentKeysArray[0] === 'text') {
    let lines: string[]
    if (contents.length > 1) {
      lines = contents
    } else if (contents.length === 1 && contents[0].includes('+')) {
      lines = contents[0].split('+')
    } else {
      lines = contents
    }
    const parsedContent = lines.map(line => getParsedText(line))
    customContentProps.content = parsedContent
  } else {
    // Only map provided content values
    // Missing values will use preset defaults (not mapped to customContentProps)
    contents.forEach((value: string, index: number) => {
      if (contentKeysArray[index] && value) {
        customContentProps[contentKeysArray[index]] = value
        console.log('[Route] Mapped content:', contentKeysArray[index], '=', value)
      }
    })
    
    // Log which keys will use defaults
    for (let i = contents.length; i < contentKeysArray.length; i++) {
      console.log('[Route] Using preset default for:', contentKeysArray[i])
    }
  }
  
  console.log('[Route] customContentProps:', customContentProps)
  
  // Process custom style props with normalization
  const normalizedStyleProps = normalizeStyleProps(customStyleProps, propsSchema)

  console.log('[Route] customStyleProps (raw):', customStyleProps)
  console.log('[Route] normalizedStyleProps:', normalizedStyleProps)
  console.log('[Route] Calling generateImage...')

  try {
    const image = await generateImage({
      preset,
      customContentProps,
      customStyleProps: normalizedStyleProps,
      format
    })
    
    console.log('[Route] Image generated successfully')
    console.log('[Route] ========== Request End ==========')

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
  } catch (error) {
    console.error('[Route] ERROR generating image:', error)
    console.log('[Route] ========== Request End (Error) ==========')
    throw error
  }
})
