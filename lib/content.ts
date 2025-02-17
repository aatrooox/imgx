// 处理内容

import { getBase64IconURL } from "./icons";
import type { SafeComponentProps } from "./params";
// 单个文字块类型
export interface TextPart {
  text: string
  type: 'text' | 'emoji' | 'accent' // 正常文字 ｜ Emoji ｜ 强调文字
  color?: string
  accentColor?: string
  base64URL?: string | null // 以base64编码的 dataURL 作为背景图加载。如 svg emoji icon、背景图等
}

export type LinePart = TextPart[]

export type ParsedContent = LinePart[]

/**
 * 处理内容（根据特定格式, 格式不同需要先转换）
 * @param content 内容
 * @param splitSymbol 分隔符
 * @returns 带有处理好的字号、对齐方式、背景图等信息的内容数组
 */
export function getParsedContent(content: string, safeProps: SafeComponentProps, splitSymbol: string = '+'):ParsedContent {
  if (!content) return [];
  const contents = content.split(splitSymbol);
  if (contents.length) {
    const colors = adjustedAttrs(contents, safeProps.color as string[])
    const accentColors = adjustedAttrs(contents, safeProps.accentColor as string[])
    return contents.map( (text, index) => {
      return getParsedText(text, colors[index], accentColors[index])
    })
  }

  return []
}


/**
 * 解析单行文本，提取出强调、emoji、普通文本
 * @param content 单行文本
 * @returns 文本块数组
 */
export function getParsedText(content: string, textColor: string, accentColor: string): LinePart {
  const parts: LinePart = []
  let lastIndex = 0
  const regex = /\[(.*?)\]|\*(.*?)\*/g

  let match
  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        text: content.slice(lastIndex, match.index),
        color: `#${textColor}`,
        type: 'text'
      })
    }

    if (match[1] !== undefined) {
      // [] 标记的内容 表情
      const base64URL = getBase64IconURL(match[1], 30)
      parts.push({
        text: match[1],
        type: base64URL && 'emoji' || 'text',
        base64URL: getBase64IconURL(match[1], 30)
      })
    } else if (match[2] !== undefined) {
      // ** 标记的内容 强调
      parts.push({
        text: match[2],
        type: 'accent',
        accentColor: `#${accentColor}`
      })
    }

    lastIndex = regex.lastIndex
  }

  // 添加剩余的文本
  if (lastIndex < content.length) {
    parts.push({
      text: content.slice(lastIndex),
      type: 'text'
    })
  }

  return parts
}

// 根据内容数组的长度，补全或删除属性数组
export function adjustedAttrs(contents: string[], attrs: string[]) {
  return attrs.length < contents.length
  ? [...attrs, ...Array(contents.length - attrs.length).fill(attrs[attrs.length - 1])]
  : attrs.slice(0, contents.length);
}