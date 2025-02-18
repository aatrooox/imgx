import { Resvg } from '@resvg/resvg-js'
import { satori, html } from '~/utils/satori';
import BiaoTiHei from '~/assets/fonts/YouSheBiaoTiHei-2.ttf';
import DouyinBold from '~/assets/fonts/DouyinSansBold.otf';
import { sizes } from '~/lib/sizes';
import type { SizeCode } from '~/lib/sizes';
import { getParsedBgColor, serverTemplates } from '~/lib/template';
import type { TemplateCode } from '~/lib/template'
import { getBase64IconURL } from '~/lib/icons';
import { getParsedContent } from '~/lib/content';

import type { Component } from 'vue';
import { getGradientTextColor, getTextColor, randomBrightHexColor, randomGradientColors, randomHexColor } from '~/utils/color';
import { getSafeComponentProps } from '~/lib/params';
import { imgGenerateSchame } from '~/lib/schema';

export async function getComponent(name: TemplateCode): Promise<Component> {
  const module = await serverTemplates[name]()
  return module.default
}

export default defineEventHandler(async (event) => {
  const text = decodeURI(getRouterParam(event, 'text') || '')
  const size = getRouterParam(event, 'size') as SizeCode;
  const template = getRouterParam(event, 'template') as TemplateCode;

  const query = await useSafeValidatedQuery(event, imgGenerateSchame)
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
  
  if (!query.success) {
      throw createError({
        statusCode: 400,
        statusMessage: (query as any).message ?? '参数错误'
      })
    }
  
  const params = query.data;
  const safeProps = getSafeComponentProps(params)

  const componnet = await getComponent(template)
  const svg = await satori(componnet, {
    props: {
      title: parsedText,
      ...safeProps,
    },
    width: sizes[size].width * (safeProps.ratio as number),
    height: sizes[size].height * (safeProps.ratio as number),
    fonts: [
      {
        name: 'YouSheBiaoTiHei',
        data: BiaoTiHei,
        weight: 400,
        style: 'normal',
      },
      {
        name: 'DouyinSansBold',
        data: DouyinBold,
        weight: 400,
        style: 'normal',
      }
    ],
    graphemeImages: {
      
    }
  })
  // console.log(`imgx => ${sizes[size].width} x ${sizes[size].height} x ${ratio} - center:${center} - accentColor:${accentColor} - color:${color}`)
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