import { Resvg } from '@resvg/resvg-js'
import { renderErrorSvg, vueTemplateToSatori, renderSVGBySatori } from './satori'

interface GenerateImageOptions {
  preset: any
  customContentProps?: Record<string, any>
  customStyleProps?: Record<string, any>
  format?: 'svg' | 'png'
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
  const { template } = preset.templateInfo

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

  const vNode = await vueTemplateToSatori(template, {
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
