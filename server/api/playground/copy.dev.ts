import { readFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event) || {}
    const { action } = body

    if (action === 'template') {
      // 使用 Node.js 的 fs 模块读取当前文件的预览区域代码
      const filePath = resolve(process.cwd(), 'pages/playground.vue')
      const fileContent = readFileSync(filePath, 'utf-8')
      
      // 提取预览区域的代码
      const previewRegex = /<!-- 以下是实际需要调试的内容 -->([\s\S]*?)<!-- 以上是实际需要调试的内容 -->/
      const match = fileContent.match(previewRegex)
      
      if (match && match[1]) {
        const previewCode = `${match[1].trim()}`
        return { success: true, data: previewCode }
      } else {
        return { success: false, error: '无法提取模板代码' }
      }
    }
    
    return { success: false, error: '无效的操作' }
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || '复制模板失败'
    }
  }
})
