import { generateImage } from '~/server/utils/image'
import { renderErrorSvg } from '~/server/utils/satori'
import { setCacheHeaders } from '~/server/utils/cache'
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
   
   // Parse and validate scale parameter
   const scaleRaw = query.data?.scale
   const scale = scaleRaw ? parseFloat(scaleRaw as string) : 1
   if (isNaN(scale) || scale < 0.5 || scale > 5) {
     throw createError({ statusCode: 400, statusMessage: 'Invalid scale parameter. Must be between 0.5 and 5.' })
   }
  
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
    setCacheHeaders(event)
    
    const svg = await renderErrorSvg('Preset not found', { width: 300, height: 100 })
    return svg
  }
  
  const contentKeys = preset?.contentKeys || ''
  const propsSchema = preset?.propsSchema || []

  console.log('[Route] contentKeys:', contentKeys)
  console.log('[Route] propsSchema:', propsSchema)

  // Process custom content props
  const customContentProps: Record<string, string> = {}
  // Handle both string and array formats for contentKeys
  const contentKeysArray = Array.isArray(contentKeys) 
    ? contentKeys 
    : contentKeys.split(',')
  
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
       format,
       scale
     })
    
    console.log('[Route] Image generated successfully')
    console.log('[Route] ========== Request End ==========')

    setHeader(event, 'Content-Type', format === 'svg' ? 'image/svg+xml' : 'image/png')
    if (download) {
      setHeader(event, 'Content-Disposition', `attachment; filename="imgx-${presetCode}-${new Date().getTime()}.${format}"`)
    }
    
    const etag = `"${Buffer.from(JSON.stringify({ ...getQuery(event), scale })).toString('base64')}"`
    const is304 = setCacheHeaders(event, etag)

    if (is304) {
      return null
    }

    return image
  } catch (error) {
    console.error('[Route] ERROR generating image:', error)
    console.log('[Route] ========== Request End (Error) ==========')
    throw error
  }
})
