import { Resvg } from '@resvg/resvg-js'
import { satori, html } from '~/utils/satori';
import BiaoTiHei from '~/assets/fonts/YouSheBiaoTiHei-2.ttf';
import { presets } from '~/lib/preset';
import type { PresetCode } from '~/lib/preset';
import { serverTemplates } from '~/lib/template';
import type { TemplateCode } from '~/lib/template'
import type { Component } from 'vue';
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
  const props: any = { title:  parsedText }
  if (template === '001') {
    if (bgColor) props.bgColor = `${bgColor}`
    if (color) props.color = `#${color}`
    if (accentColor) props.accentColor = `#${accentColor}`
    if (center === 1) props.center = true
    props.fontSize = ratio * presets[preset].fontSize
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
  console.log(`imgx => ${presets[preset].width} x ${presets[preset].height} x ${ratio} - center:${bgColor} - accentColor:${accentColor} - color:${color}`)
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