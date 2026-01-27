import { Resvg } from '@resvg/resvg-js'
import type { Preset } from './preset'
import { renderErrorSvg, vueTemplateToSatori, renderSVGBySatori } from './satori'
import { BaseTemplate } from '../templates/Base'
import { ArticleCoverTemplate } from '../templates/ArticleCover'
import { MacFolderTemplate } from '../templates/MacFolder'
import { CleanTitleTemplate } from '../templates/CleanTitle'

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
}

export async function generateImage({ 
  preset, 
  customContentProps = {}, 
  customStyleProps = {}, 
  format = 'png' 
}: GenerateImageOptions) {
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
  
  // Process custom style props
  const styleFinalProps = {
    ...(styleProps as Record<string, any>),
    ...customStyleProps
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
      mode: 'original',
    },
  })

  return resvg.render().asPng()
}
