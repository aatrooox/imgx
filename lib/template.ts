import { defineAsyncComponent, type Component } from 'vue';
import { getBase64IconURL } from './icons';

export const templates = {
  '001': defineAsyncComponent(() => import('~/components/template/Base.vue')),
  // '002': defineAsyncComponent(() => import('~/components/ImgTemplate2.vue')),
  // '003': defineAsyncComponent(() => import('~/components/ImgTemplate3.vue'))
}

export const serverTemplates = {
  '001': () => import('~/components/template/Base.vue'),
  // '002': () => import('~/components/ImgTemplate2.vue'),
  // '003': () => import('~/components/ImgTemplate3.vue')
}

export type TemplateCode = keyof typeof templates;

export function getParsedBgColor(color: string) {
  const colors = color.split('-');
  function getSingleColor(color: string) {
    return color.includes('#') ? color : `#${color}`
  }
  if (colors.length === 1) {
    return {
      bgColor: colors[0].includes(',') ? colors[0] : getSingleColor(colors[0])
    }
  }

  if (colors.length >= 2) {
    return {
      bgImage: `linear-gradient(to right, ${getSingleColor(colors[0])}, ${getSingleColor(colors[1])})`
    }
  }

  return {
    bgColor: `rgba(243,244,212)`
  }
}

// 解析文本，提取出强调部分
export function getParsedText(content: string) {
  const parts = []
  let lastIndex = 0
  // 修改正则表达式以匹配 [] 和 ** 两种模式
  // 使用捕获组来区分不同类型的标记
  const regex = /\[(.*?)\]|\*(.*?)\*/g

  let match
  while ((match = regex.exec(content)) !== null) {
    // 添加标签前的文本
    if (match.index > lastIndex) {
      parts.push({
        text: content.slice(lastIndex, match.index),
        isTag: false,
        type: 'text'
      })
    }

    // 判断是哪种标记并添加相应的文本
    if (match[1] !== undefined) {
      // [] 标记的内容 表情
      const base64URL = getBase64IconURL(match[1], 30)
      parts.push({
        text: match[1],
        type: base64URL && 'emoji' || 'text',
        url: getBase64IconURL(match[1], 30)
      })
    } else if (match[2] !== undefined) {
      // ** 标记的内容
      parts.push({
        text: match[2],
        type: 'accent'
      })
    }

    lastIndex = regex.lastIndex
  }

  // 添加剩余的文本
  if (lastIndex < content.length) {
    parts.push({
      text: content.slice(lastIndex),
      isTag: false,
      type: 'text'
    })
  }

  return parts
}