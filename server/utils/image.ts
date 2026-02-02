import { Resvg } from '@resvg/resvg-js'
import type { Preset } from './preset'
import { renderErrorSvg, vueTemplateToSatori, renderSVGBySatori } from './satori'
import { WeChatCoverTemplate } from '../templates/WeChatCover'
import { TechCoverTemplate } from '../templates/TechCover'
import { TicketCardTemplate } from '../templates/TicketCard'
import { PixelMatrixTemplate, IMGX_LETTERS_MATRIX, IMGX_LETTERS_EMOJI_MATRIX, ZOTEPAD_EMOJI_MATRIX } from '../templates/PixelMatrix'
import { getBase64IconURL } from '~/lib/icons'
import { getServerAssetImageBase64Cached } from './image-loader'

interface GenerateImageOptions {
  preset: Preset
  customContentProps?: Record<string, any>
  customStyleProps?: Record<string, any>
  format?: 'svg' | 'png'
  scale?: number
}

const templateStrings: Record<string, string> = {
  'WeChatCover': WeChatCoverTemplate,
  'TechCover': TechCoverTemplate,
  'TicketCard': TicketCardTemplate,
  'PixelMatrix': PixelMatrixTemplate,
}

/**
 * Check if a string is an icon name (format: prefix:name)
 */
function isIconName(value: any): boolean {
  return typeof value === 'string' && /^[a-z0-9-]+:[a-z0-9-]+$/i.test(value)
}

export async function generateImage({ 
  preset, 
  customContentProps = {}, 
  customStyleProps = {}, 
  format = 'png',
  scale = 1
}: GenerateImageOptions) {
  console.log('[Image] generateImage called')
  console.log('[Image] preset:', preset.code, preset.name)
  console.log('[Image] customContentProps:', customContentProps)
  console.log('[Image] customStyleProps:', customStyleProps)
  
  if (!preset) {
    return await renderErrorSvg('Preset not found', { width: 300, height: 100 })
  }

  const { width, height, contentProps, styleProps } = preset
  const { template } = preset

  // Process custom content props
  const contentFinalProps = {
    ...(contentProps as Record<string, any>),
    ...customContentProps
  }
  
  console.log('[Image] contentFinalProps before icon conversion:', contentFinalProps)
  
  if (template === 'PixelMatrix') {
    // Select matrix based on preset code
    if (preset.code === '106') {
      contentFinalProps.characterMatrix = ZOTEPAD_EMOJI_MATRIX
    } else {
      contentFinalProps.characterMatrix = IMGX_LETTERS_EMOJI_MATRIX
    }
    
    const pixelSize = (styleProps as any)?.pixelSize || (customStyleProps as any)?.pixelSize || 20
    
    const processedMatrix = contentFinalProps.characterMatrix.map((row: any[]) => 
      row.map((cell: any) => {
        if (typeof cell === 'string' && isIconName(cell)) {
          return getBase64IconURL(cell, pixelSize)
        }
        return cell
      })
    )
    
    contentFinalProps.characterMatrix = processedMatrix
  }
  
  // Process custom style props first (before icon conversion needs iconSizes)
  const styleFinalProps = {
    ...(styleProps as Record<string, any>),
    ...customStyleProps
  }
  
  console.log('[Image] styleFinalProps:', styleFinalProps)
  
  // Convert icon names to base64 URLs
  for (const key in contentFinalProps) {
    console.log('[Image] Checking prop:', key, '=', contentFinalProps[key])
    
    if (key.toLowerCase().includes('icon') && isIconName(contentFinalProps[key])) {
      console.log('[Image] Found icon prop:', key, 'icon name:', contentFinalProps[key])
      
      // Use merged styleFinalProps to get iconSizes (not preset.styleProps)
      const iconSizes = styleFinalProps?.iconSizes
      const iconSize = Array.isArray(iconSizes) ? iconSizes[0] : 80
      
      console.log('[Image] iconSizes from styleFinalProps:', iconSizes)
      console.log('[Image] Using icon size:', iconSize)
      
      contentFinalProps[key] = getBase64IconURL(contentFinalProps[key], iconSize)
      
      console.log('[Image] Converted to base64 URL:', contentFinalProps[key] ? 'success' : 'FAILED')
      if (contentFinalProps[key]) {
        console.log('[Image] Base64 URL preview:', contentFinalProps[key].substring(0, 100) + '...')
      }
    }
  }
  
  console.log('[Image] contentFinalProps after icon conversion:', contentFinalProps)

   if (styleFinalProps?.logoPath && typeof styleFinalProps.logoPath === 'string') {
     console.log('[Image] Processing logoPath:', styleFinalProps.logoPath)
     
     if (!styleFinalProps.logoPath.startsWith('data:') && !styleFinalProps.logoPath.startsWith('http')) {
       const logoBase64 = await getServerAssetImageBase64Cached(styleFinalProps.logoPath)
       
       if (logoBase64) {
         styleFinalProps.logoUrl = logoBase64
         console.log('[Image] Logo loaded successfully from server assets')
       } else {
         console.error('[Image] Failed to load logo from server assets:', styleFinalProps.logoPath)
       }
     } else {
       styleFinalProps.logoUrl = styleFinalProps.logoPath
     }
   }

   // Validate and sanitize base64 in logoUrl (prevent query-string corruption)
   if (styleFinalProps.logoUrl && typeof styleFinalProps.logoUrl === 'string' && styleFinalProps.logoUrl.startsWith('data:')) {
     const idx = styleFinalProps.logoUrl.indexOf(',');
     if (idx !== -1) {
       const head = styleFinalProps.logoUrl.slice(0, idx + 1);
       let body = styleFinalProps.logoUrl.slice(idx + 1);
       
       // Check for whitespace corruption (+ → space from query parsing)
       if (/\s/.test(body)) {
         console.warn('[Image] Base64 contains whitespace - sanitizing (possible query encoding issue)');
         body = body.replace(/\s+/g, '');  // Remove all whitespace
       }
       
       // Validate base64 charset
       if (!/^[A-Za-z0-9+/=]+$/.test(body)) {
         console.error('[Image] Invalid base64 characters detected:', body.slice(0, 100));
         throw createError({ statusCode: 500, statusMessage: 'Invalid image data encoding' });
       }
       
       styleFinalProps.logoUrl = head + body;
     }
   }

   const templateString = templateStrings[template] || template
  const vNode = await vueTemplateToSatori(templateString, {
    ...contentFinalProps,
    ...styleFinalProps
  })
  
   const svg = await renderSVGBySatori(vNode, width, height)

   if (format === 'svg') {
     return svg
   }

   const resvg = new Resvg(svg, {
     fitTo: {
       mode: scale === 1 ? 'original' : 'zoom',
       value: scale
     },
   })

   return resvg.render().asPng()
}
