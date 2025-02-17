import { Resvg } from '@resvg/resvg-js'
import { satori, html } from '~/utils/satori';
import BiaoTiHei from '~/assets/fonts/YouSheBiaoTiHei-2.ttf';
import { sizes } from '~/lib/sizes';
import type { SizeCode } from '~/lib/sizes';
import { getParsedBgColor, serverTemplates } from '~/lib/template';
import type { TemplateCode } from '~/lib/template'
import { getBase64IconURL } from '~/lib/icons';

import type { Component } from 'vue';
import { getGradientTextColor, getTextColor, randomBrightHexColor, randomGradientColors, randomHexColor } from '~/utils/color';

export async function getComponent(name: TemplateCode): Promise<Component> {
  const module = await serverTemplates[name]()
  return module.default
}

export default defineEventHandler(async (event) => {
  const text = decodeURI(getRouterParam(event, 'text') || '')
  const query = getQuery(event);
  const size = getRouterParam(event, 'size') as SizeCode;
  const template = getRouterParam(event, 'template') as TemplateCode;
  if (!!!text) {
    throw createError({
      statusCode: 400,
      statusMessage: '文本为空',
    })
  }

  if(text.length > 200) {
    throw createError({
      statusCode: 400,
      statusMessage: '文本过长',
    })
  }

  const parsedText = text.replace(/\//g, '')

  if (!sizes[size]) {
    throw createError({
      statusCode: 400,
      statusMessage: '预设不存在',
    })
  }

  if (!serverTemplates[template]) {
    throw createError({
      statusCode: 400,
      statusMessage: '模板不存在',
    })
  }

  const _bgColor = query.bgColor;
  const color = query.color;
  const accentColor = query.accentColor;
  const center = query.center === '1' ? 1 : 0;
  const ratio = query.ratio ? +query.ratio : 1;
  const fontSize = query.fontSize ? isNaN(+query.fontSize) ? 0 : +query.fontSize : 0
  const colorRandom = query.colorRandom !== '0'; // 随机颜色
  // padding?: string
  // textWrapBgColor?: string
  // textWrapShadow?: string
  // textWrapPadding?: string
  // textWrapRounded?: string
  const padding = query.padding ?? 0
  const textWrapBgColor = query.textWrapBgColor ?? ''
  const textWrapShadow = query.textWrapShadow ?? 'none'
  const textWrapPadding = query.textWrapPadding ?? '0px'
  const textWrapRounded = query.textWrapRounded ?? 'none'
  // const iconName = query.icon as string

  const props: any = { title:  parsedText }

  // 字号
  props.fontSize = fontSize || ratio * sizes[size].fontSize   
  // emoji 默认和字号一样大
  const iconSize = query.iconSize ?  +query.iconSize : props.fontSize
  // console.log(`iconData`, iconData)
  // Use it to render icon
  props.iconSize = iconSize;
  
  if (template === '001') {
    if (_bgColor) {
      const { bgColor, bgImage } = getParsedBgColor(_bgColor as string)
      if (bgColor) {
        props.bgColor = bgColor;
      }

      if (bgImage) {
        props.bgImage = bgImage;
      }

    }
    console.log(`pros.bgColor`, props.bgColor)
    if (color) props.color = `#${color}`
    if (accentColor) props.accentColor = `#${accentColor}`
    if (center === 1) props.center = true
    if (padding) props.padding = padding 
    if (textWrapBgColor) {
      const { bgColor, bgImage } = getParsedBgColor(textWrapBgColor as string)

      if (bgColor) {
        props.textWrapBgColor = bgColor
      }
      
    }
    props.textWrapShadow = textWrapShadow
    props.textWrapPadding = textWrapPadding
    props.textWrapRounded = textWrapRounded

    if (colorRandom) {
      const bgColors = randomGradientColors('adjacent')
      const { bgColor, bgImage } = getParsedBgColor(bgColors.join('-'))
      if (bgColor) {
        props.bgColor = props.bgColor || bgColor;
      }

      if (bgImage) {
        props.bgImage = props.bgImage || bgImage;
      }
      // props.bgColor = props.bgColor || bgColors.join('-')
      props.color = props.color || `#${getGradientTextColor(bgColors)}`
      props.accentColor = props.accentColor || `#${randomBrightHexColor()}`
    }
  }
  const componnet = await getComponent(template)
  const svg = await satori(componnet, {
    props,
    width: sizes[size].width * ratio,
    height: sizes[size].height * ratio,
    fonts: [{
      name: 'YouSheBiaoTiHei',
      data: BiaoTiHei,
      weight: 400,
      style: 'normal',
    }],
    graphemeImages: {
      
    }
  })
  console.log(`imgx => ${sizes[size].width} x ${sizes[size].height} x ${ratio} - center:${center} - accentColor:${accentColor} - color:${color}`)
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'original',
    },
  })

  const png = resvg.render()

  setHeader(event, 'Content-Type', 'image/png')
  setHeader(event, 'Cache-Control', 'public, max-age=3600, immutable')
  // 生成强验证器
  const etag = `"${Buffer.from(JSON.stringify(getQuery(event))).toString('base64')}"` 
  setHeader(event, 'ETag', etag);
  setHeader(event, 'Last-Modified', new Date().toUTCString());

  // 检查客户端缓存
  const ifNoneMatch = getRequestHeader(event, 'if-none-match')
  if (ifNoneMatch === etag) {
    event.node.res.statusCode = 304
    return null
  }

  return png.asPng()

});