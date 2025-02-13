import { Resvg } from '@resvg/resvg-js'
import { satori, html } from '~/utils/satori';
import BiaoTiHei from '~/assets/fonts/YouSheBiaoTiHei-2.ttf';
import { presets } from '~/lib/preset';
import type { PresetCode } from '~/lib/preset';
import { serverTemplates } from '~/lib/template';
import type { TemplateCode } from '~/lib/template'
import type { Component } from 'vue';
import { getGradientTextColor, getTextColor, randomBrightHexColor, randomGradientColors, randomHexColor } from '~/utils/color';
export async function getComponent(name: TemplateCode): Promise<Component> {
  const module = await serverTemplates[name]()
  return module.default
}

export default defineEventHandler(async (event) => {
  const text = decodeURI(getRouterParam(event, 'text') || '')
  const query = getQuery(event);
  const preset = getRouterParam(event, 'preset') as PresetCode;
  const template = getRouterParam(event, 'template') as TemplateCode;
  if (!!!text) {
    throw createError({
      statusCode: 400,
      statusMessage: '文本为空',
    })
  }

  if(text.length > 50) {
    throw createError({
      statusCode: 400,
      statusMessage: '文本过长',
    })
  }

  const parsedText = text.replace(/\//g, '')

  if (!presets[preset]) {
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

  const bgColor = query.bgColor;
  const color = query.color;
  const accentColor = query.accentColor;
  const center = query.center === '1' ? 1 : 0;
  const ratio = query.ratio ? +query.ratio : 1;
  const fontSize = query.fs ? isNaN(+query.fs) ? 0 : +query.fs : 0
  const props: any = { title:  parsedText }
  const colorRandom = query.cr !== '0'; // 随机颜色
  if (template === '001') {
    if (bgColor) props.bgColor = `${bgColor}`
    if (color) props.color = `#${color}`
    if (accentColor) props.accentColor = `#${accentColor}`
    if (center === 1) props.center = true
    props.fontSize = fontSize || ratio * presets[preset].fontSize
    if (colorRandom) {
      const bgColors = randomGradientColors('adjacent')
      props.bgColor = props.bgColor || bgColors.join('-')
      props.color = props.color || `#${getGradientTextColor(bgColors)}`
      props.accentColor = props.accentColor || `#${randomBrightHexColor()}`
    }
  }
  const componnet = await getComponent(template)
  const svg = await satori(componnet, {
    props,
    width: presets[preset].width * ratio,
    height: presets[preset].height * ratio,
    fonts: [{
      name: 'YouSheBiaoTiHei',
      data: BiaoTiHei,
      weight: 400,
      style: 'normal',
    }],
  })
  console.log(`imgx => ${presets[preset].width} x ${presets[preset].height} x ${ratio} - center:${center} - accentColor:${accentColor} - color:${color}`)
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