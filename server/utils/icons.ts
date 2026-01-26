import { iconToSVG, iconToHTML } from '@iconify/utils'

interface IconData {
  body: string
  width?: number
  height?: number
  left?: number
  top?: number
}

/**
 * Get base64 icon URL for use in backgroundImage
 */
export async function getBase64IconURL(iconName: string, iconSize: number) {
  const svgHTML = await getIconSVGHTML(iconName, iconSize)
  if (!svgHTML) return null
   
  const base64SVG = `data:image/svg+xml;base64,${btoa(svgHTML)}`
  return base64SVG
}

export async function getIconSVGHTML(iconName: string, iconSize: number) { 
  const [prefix, iconInnerName] = iconName.split(':')
  if (!prefix || !iconInnerName) return null

  const resData = await $fetch<any>(`https://icon.zzao.club/${prefix}.json?icons=${iconInnerName}&width=${iconSize}&height=${iconSize}`)
  const iconData = resData.icons[iconInnerName] as IconData

  if (!iconData) return null

  const sizes = {
    width: iconData.width ?? resData.width ?? 50,
    height: iconData.height ?? resData.height ?? 50
  }
  const renderData = iconToSVG({ ...iconData, ...sizes }, sizes)

  const iconSVG = iconToHTML(renderData.body, renderData.attributes)
  return iconSVG
}
