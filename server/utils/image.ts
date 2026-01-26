import { Resvg } from '@resvg/resvg-js'
import type { Preset } from './preset'
import { renderErrorSvg, vueTemplateToSatori, renderSVGBySatori } from './satori'

interface GenerateImageOptions {
  preset: Preset
  customContentProps?: Record<string, any>
  customStyleProps?: Record<string, any>
  format?: 'svg' | 'png'
}

const templateStrings: Record<string, string> = {
  'Base': `<div class="w-full h-full flex items-center justify-center transition-all duration-300"
    :style="{ backgroundColor: bgColor ?? 'transparent', backgroundImage: bgImage ?? 'linear-gradient(to right, transparent, transparent)', padding: padding, fontFamily: fontFamily }">
    <div :class="[\`text-wrap flex w-full h-full rounded-\${textWrapRounded} shadow-\${textWrapShadow}\`]"
      :style="{ backgroundColor: textWrapBgColor, padding: textWrapPadding , justifyContent: verticalAligns[0] ?? 'center' }">
      <div class="flex flex-col w-full">
        <template v-for="(line, index) in content">
          <div :class="['font-bold flex', aligns[index]]" :style="{ color: colors[index], fontSize: fontSizes[index] }">
            <template v-for="(text, index) in line" :key="index">
              <span class="flex" v-if="text.type === 'emoji'"
                :style="{ width: iconSizes && iconSizes[index] + 'px', height: iconSizes && iconSizes[index] + 'px', backgroundImage: \`url(\${text.base64URL})\`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }"></span>
              <span class="text-nowrap" v-else
                :style="{ color: text.type === 'accent' ? (accentColors[index] || '') : '' }">
                {{ text.text }}
              </span>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>`
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
