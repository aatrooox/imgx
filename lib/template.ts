import { defineAsyncComponent, type Component } from 'vue';

export const templates = {
  '001': defineAsyncComponent(() => import('~/components/ImgTemplate1.vue')),
  // '002': defineAsyncComponent(() => import('~/components/ImgTemplate2.vue')),
  // '003': defineAsyncComponent(() => import('~/components/ImgTemplate3.vue'))
}

export const serverTemplates = {
  '001': () => import('~/components/ImgTemplate1.vue'),
  // '002': () => import('~/components/ImgTemplate2.vue'),
  // '003': () => import('~/components/ImgTemplate3.vue')
}

export type TemplateCode = keyof typeof templates;

export function getParsetBgColor(color: string) {
  const colors = color.split('-');
  if (colors.length === 1) {
    return {
      backgroundColor: colors[0].includes(',') ? colors[0] : `#${colors[0]}`
    }
  }

  if (colors.length >= 2) {
    return {
      backgroundImage: `linear-gradient(to right, #${colors[0]}, #${colors[1]})`
    }
  }

  return {
    backgroundColor: `rgba(243,244,212)`
  }
}

export function getParsedText(content: string) {
  const parts = []
  let lastIndex = 0
  const regex = /\[(.*?)\]/g

  let match
  while ((match = regex.exec(content)) !== null) {
    // 添加标签前的文本
    if (match.index > lastIndex) {
      parts.push({
        text: content.slice(lastIndex, match.index),
        isTag: false
      })
    }

    // 添加标签内的文本
    parts.push({
      text: match[1],
      isTag: true
    })

    lastIndex = regex.lastIndex
  }

  // 添加剩余的文本
  if (lastIndex < content.length) {
    parts.push({
      text: content.slice(lastIndex),
      isTag: false
    })
  }

  return parts
}