import { renderToString } from 'vue/server-renderer'
import type { AllowedComponentProps, VNodeProps } from 'vue'
import { createSSRApp } from 'vue'
import { html as _html } from 'satori-html'
import _satori from 'satori'
import { getBase64IconURL } from './icons'
import BiaoTiHei from '~/assets/fonts/YouSheBiaoTiHei-2.ttf'
import DouyinSansBold from '~/assets/fonts/DouyinSansBold.otf'

// Tailwind CSS class to style value mapping
export const gapSizeMap: Record<string, string> = {
  '0': '0',
  'px': '1px',
  '0.5': '0.125rem',
  '1': '0.25rem',
  '1.5': '0.375rem',
  '2': '0.5rem',
  '2.5': '0.625rem',
  '3': '0.75rem',
  '3.5': '0.875rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '7': '1.75rem',
  '8': '2rem',
  '9': '2.25rem',
  '10': '2.5rem',
  '11': '2.75rem',
  '12': '3rem',
  '14': '3.5rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '28': '7rem',
  '32': '8rem',
  '36': '9rem',
  '40': '10rem',
  '44': '11rem',
  '48': '12rem',
  '52': '13rem',
  '56': '14rem',
  '60': '15rem',
  '64': '16rem',
  '72': '18rem',
  '80': '20rem',
  '96': '24rem',
}

export const spacingClassMap: Record<string, { property: string; direction?: string }> = {
  'gap': { property: 'gap' },
  'gap-x': { property: 'columnGap' },
  'gap-y': { property: 'rowGap' },
  'space-x': { property: 'marginLeft', direction: 'horizontal' },
  'space-y': { property: 'marginTop', direction: 'vertical' },
}

// SatoriNode interface
export interface SatoriNode {
  type: string
  props: {
    tw?: string
    style?: Record<string, any>
    children?: string | SatoriNode | SatoriNode[]
    [key: string]: any
  }
}

export type ExtractComponentProps<TComponent> =
  TComponent extends new () => {
    $props: infer P
  }
    ? Omit<P, keyof VNodeProps | keyof AllowedComponentProps>
    : never

export interface VNode {
  type: string
  props: {
    style?: Record<string, any>
    children?: string | VNode | VNode[]
    [prop: string]: any
  }
}

/**
 * Get fully rendered HTML string
 */
export async function getPreviewHtml(template: string, props: Record<string, any>): Promise<string> {
  try {
    const processedProps = { ...props }
    const iconProps: Record<string, string> = {}
    
    Object.keys(processedProps).forEach(key => {
      const value = processedProps[key]
      if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
        iconProps[key] = value
      }
    })
    
    for (const key in iconProps) {
      const iconStr = iconProps[key]
      const iconInfo = iconStr.slice(1, -1).split(':')
      if (iconInfo.length < 2) {
        console.log(`icon ${iconStr} not valid`)
        continue
      }
      const iconPrefix = iconInfo[0]
      const iconName = iconInfo[1]
      const iconSize = parseInt(iconInfo[2]) || 50
      const base64IconURL = await getBase64IconURL(`${iconPrefix}:${iconName}`, iconSize)
      
      if (!base64IconURL) {
        console.log(`icon ${iconStr} parse failed`)
        processedProps[key] = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAmdJREFUeF7tmQtuwyAMhsPJtp5s28nWnYzVU4gcYoNNWHGKI01aVajNx+8HJCyTP2Hy9S8OwBUwOQEPgckF4EnQQ8BDYHICHgKTC8CrgIeAh8DkBDwESgKIMb6HEO4SkWjGpt+DOfC/1AaeJ5kj8YlVQIzxe1mWPwcfPn6FED4pEOsiPiRjYX6MEX7nDY3HP8vaQXPBVnpuHAip/ySA1UlsCAySxqix4UErh0WA4oRVgh2zSfcQwo2wBZBF/msAcMZyp0hY8UFKEkppTA5xBQiq3D0MbAoA6T8HAMs/GWwGwCiqxmNnTwlA7P+/A2hc/CHGXxHAFusFSJsKrgyAkuMh0WVZ+xB2VwZAJT8KAJRcNsm9GoBDSa0tsPY9zqg1NeGxz0iC0jJpXgEAjmqLU7eIwW47zNT/bgpQ+KTqA8jdqBVuqkXtBWBthVXNlKRr5ELAKgCqokj3Ra4A5uAhNbRrhTsr4MzG6ACchNA9ByT6JzpLPYDMKHyEY2z+PCUJEic+sAt/Up/aAZS0X5N47XsEuVgGNfF3ug9QGivWeQdA3wNQfQB1hofrMvW9pTUFiM7mTHIj47am0CsAgDVIjsPFO0IOhDUAZ2r39QGs/URLB9e0+IK9MWUQlTlVH9+S/JAt0SUMjFdnWKIhORjjnBd2cXDihN0XvZCh8gBzd0AqqgeAPMa1LzfSGmDBP9wLmFrmJzYGl1W2mpwGgDs57a61vhrTwKi9HusGQOOUpbEOwNJujPDFFTCCuiWbrgBLuzHCF1fACOqWbLoCLO3GCF9cASOoW7LpCrC0GyN8cQWMoG7J5vQK+AVP7kZf9uNYzQAAAABJRU5ErkJggg=='
        continue
      }
      processedProps[key] = base64IconURL
    }

    const component = {
      template,
      props: Object.keys(props),
      setup() {
        const componentProps = { ...processedProps }
        return componentProps
      }
    }

    const app = createSSRApp(component, processedProps)
    const html = await renderToString(app)
    return html
  } catch (err) {
    return ''
  }
}

export async function vueTemplateToSatori(template: string, props: Record<string, any>): Promise<SatoriNode> {
  try {
    const html = await getPreviewHtml(template, props)
    const satoriNode = _html(html)
    
    const processTailwindClasses = (twClasses: string): { tw: string; styles: Record<string, string> } => {
      const styles: Record<string, string> = {}
      const remainingClasses: string[] = []
      
      twClasses.split(' ').forEach(cls => {
        let matched = false
        
        for (const [prefix, config] of Object.entries(spacingClassMap)) {
          if (cls.startsWith(`${prefix}-`)) {
            const size = cls.substring(prefix.length + 1)
            if (gapSizeMap[size]) {
              styles[config.property] = gapSizeMap[size]
              matched = true
              break
            }
          }
        }
        
        if (!matched) {
          remainingClasses.push(cls)
        }
      })
      
      return { tw: remainingClasses.join(' '), styles }
    }

    const processNode = (node: any): SatoriNode => {
      if (typeof node === 'string') {
        return { type: 'span', props: { children: node } }
      }

      if (!node || typeof node !== 'object') {
        return { type: 'div', props: { children: '' } }
      }

      const newProps: any = { ...node.props }
      let allClasses = ''
      
      if (newProps.class) {
        allClasses += newProps.class + ' '
        delete newProps.class
      }
      
      if (newProps.className) {
        allClasses += newProps.className + ' '
        delete newProps.className
      }
      
      if (node.type !== 'span' && !allClasses.includes('flex')) {
        allClasses = `flex ${allClasses}`
      }
      
      if (allClasses.trim()) {
        const { tw, styles } = processTailwindClasses(allClasses.trim())
        if (tw) {
          newProps.tw = tw
        }
        if (Object.keys(styles).length > 0) {
          newProps.style = { ...newProps.style || {}, ...styles }
        }
      }
      
      if (newProps.children) {
        if (Array.isArray(newProps.children)) {
          newProps.children = newProps.children
            .map((child: any) => child ? processNode(child) : null)
            .filter(Boolean)
        } else if (typeof newProps.children === 'object') {
          newProps.children = processNode(newProps.children)
        }
      }

      return { type: node.type, props: newProps }
    }

    return processNode(satoriNode)
  } catch (error: any) {
    console.error('Error in vueTemplateToSatori:', error)
    return {
      type: 'div',
      props: {
        style: { color: 'red', padding: '20px' },
        children: `Error converting template: ${error.message}`
      }
    }
  }
}

export async function renderErrorSvg(errMsg: string, options: { width: number; height: number }) {
  const width = options.width || 300
  const height = options.height || 100
  const vNode: SatoriNode = {
    type: 'div',
    props: {
      style: { color: 'red', padding: '20px', textAlign: 'center', fontSize: '26px', fontFamily: 'YouSheBiaoTiHei' },
      children: `${errMsg}`
    }
  }

  const svg = await renderSVGBySatori(vNode, width, height)
  return svg
}

export async function renderSVGBySatori(vNode: SatoriNode, width: number, height: number) {
  const fonts: any[] = [
    {
      name: 'YouSheBiaoTiHei',
      data: BiaoTiHei,
      weight: 400,
      style: 'normal',
    },
    { 
      name: 'DouyinSansBold',
      data: DouyinSansBold,
      weight: 400,
      style: 'normal'
    }
  ]

  const svg = await _satori(
    vNode,
    {
      width,
      height,
      fonts,
    }
  )

  return svg
}
