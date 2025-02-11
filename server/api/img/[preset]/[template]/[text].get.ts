import { Resvg } from '@resvg/resvg-js'
import { satori, html } from '~/utils/satori';
import BiaoTiHei from '~/assets/fonts/YouSheBiaoTiHei-2.ttf';
import Image from '~/components/ImgxRender.vue';
import Image1 from '~/components/ImgTemplate1.vue';
import { serverTemplates } from '~/lib/template';
import type { TemplateCode } from '~/lib/template'
import type { Component } from 'vue';
export async function getComponent(name: TemplateCode): Promise<Component> {
  const module = await serverTemplates[name]()
  return module.default
}

export default defineEventHandler(async (event) => {
  const text = decodeURI(getRouterParam(event, 'text') || '')
  const preset = getRouterParam(event, 'preset') as string;
  const template = getRouterParam(event, 'template') as TemplateCode;
  const { presetConfig } = useAppConfig();
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

  if (!presetConfig[preset]) {
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
  const componnet = await getComponent(template)
  const svg = await satori(componnet, {
    props: {
      title: parsedText,
    },
    width: presetConfig[preset].width,
    height: presetConfig[preset].height,
    fonts: [{
      name: 'YouSheBiaoTiHei',
      data: BiaoTiHei,
      weight: 400,
      style: 'normal',
    }],
  })

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