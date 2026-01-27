import { Resvg } from '@resvg/resvg-js'
import type { Preset } from './preset'
import { renderErrorSvg, vueTemplateToSatori, renderSVGBySatori } from './satori'
import { BaseTemplate } from '../templates/Base'
import { ArticleCoverTemplate } from '../templates/ArticleCover'
import { MacFolderTemplate } from '../templates/MacFolder'
import { CleanTitleTemplate } from '../templates/CleanTitle'
import { WeChatCoverTemplate } from '../templates/WeChatCover'
import { getBase64IconURL } from '~/lib/icons'

interface GenerateImageOptions {
  preset: Preset
  customContentProps?: Record<string, any>
  customStyleProps?: Record<string, any>
  format?: 'svg' | 'png'
}

const templateStrings: Record<string, string> = {
  'Base': BaseTemplate,
  '001': BaseTemplate,
  'ArticleCover': ArticleCoverTemplate,
  'MacFolder': MacFolderTemplate,
  'CleanTitle': CleanTitleTemplate,
  'WeChatCover': WeChatCoverTemplate,
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
  format = 'png' 
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
      mode: 'original',
    },
  })

  return resvg.render().asPng()
}
