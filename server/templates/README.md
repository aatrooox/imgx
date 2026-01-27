# IMGX Template Strings

此目录存放所有用于 Satori 渲染的 Vue 模板字符串。

## 架构说明

### 为什么需要这个目录？

IMGX 使用 [Satori](https://github.com/vercel/satori) 将 Vue 模板字符串转换为 SVG，再通过 Resvg 转换为 PNG。Satori 只能接受**纯模板字符串**，不能直接导入 `.vue` 文件，因此所有模板都必须以字符串形式存储。

### 文件结构

```
server/templates/
  ├── README.md          # 本文件
  ├── Base.ts            # 基础模板
  ├── ArticleCover.ts    # 文章封面模板
  ├── MacFolder.ts       # Mac 文件夹模板
  └── CleanTitle.ts      # 简洁标题模板
```

每个文件导出一个命名的模板字符串常量：

```typescript
// CleanTitle.ts
export const CleanTitleTemplate = `<div class="w-full h-full flex...">
  ...
</div>`
```

### 使用方式

在 `server/utils/image.ts` 中导入并注册：

```typescript
import { CleanTitleTemplate } from '../templates/CleanTitle'

const templateStrings: Record<string, string> = {
  'CleanTitle': CleanTitleTemplate,
  ...
}
```

## 创建新模板

### 步骤 1: 创建模板文件

在 `server/templates/` 目录下创建新文件，例如 `MyTemplate.ts`：

```typescript
export const MyTemplateTemplate = `<div class="w-full h-full flex items-center justify-center"
  :style="{ backgroundColor: bgColor, padding: padding, fontFamily: fontFamily }">
  <div class="flex flex-col w-full">
    <template v-for="(line, lineIdx) in content" :key="lineIdx">
      <div :class="['flex font-bold', aligns[lineIdx]]" 
        :style="{ color: colors[lineIdx], fontSize: fontSizes[lineIdx] }">
        <template v-for="(part, partIdx) in line" :key="partIdx">
          <span v-if="part.type === 'emoji'" class="flex"
            :style="{ width: fontSizes[lineIdx], height: fontSizes[lineIdx], backgroundImage: \`url(\${part.base64URL})\`, backgroundSize: '100% 100%' }"></span>
          <span v-else-if="part.type === 'accent'" class="flex"
            :style="{ color: accentColors[lineIdx] }">
            {{ part.text }}
          </span>
          <span v-else class="flex">
            {{ part.text }}
          </span>
        </template>
      </div>
    </template>
  </div>
</div>`
```

### 步骤 2: 注册模板

在 `server/utils/image.ts` 中导入并注册：

```typescript
import { MyTemplateTemplate } from '../templates/MyTemplate'

const templateStrings: Record<string, string> = {
  // ... 其他模板
  'MyTemplate': MyTemplateTemplate,
}
```

### 步骤 3: 创建预设

在 `presets/` 目录下创建 JSON 配置文件，例如 `007.json`：

```json
{
  "code": "007",
  "name": "My Template Name",
  "description": "模板描述",
  "template": "MyTemplate",
  "width": 1200,
  "height": 630,
  "contentProps": {
    "content": [[{"text": "示例文本", "type": "text"}]]
  },
  "styleProps": {
    "bgColor": "#ffffff",
    "colors": ["#000000"],
    "fontSizes": ["48px"],
    "aligns": ["justify-center"],
    "fontFamily": "YouSheBiaoTiHei",
    "padding": "60px"
  },
  "contentKeys": "text"
}
```

## Satori 约束

### 必须遵守的规则

1. **所有 `<div>` 都需要 `class="flex"`**
   ```html
   <div class="flex">...</div>
   ```

2. **根元素必须是 `w-full h-full`**
   ```html
   <div class="w-full h-full flex">...</div>
   ```

3. **只支持 Flexbox 布局**
   - 不支持 Grid
   - 不支持绝对定位（除非特殊场景）

4. **不支持的 CSS 属性**
   - ❌ `box-shadow`
   - ❌ `transform`
   - ❌ `filter`
   - ❌ `animation`
   - ❌ `transition`

5. **图片必须用 base64 DataURL**
   ```html
   <span :style="{ backgroundImage: `url(${part.base64URL})` }"></span>
   ```

### Props 规范

每个模板都会接收以下 props（来自 `componentBaseProps` 接口）：

```typescript
interface componentBaseProps {
  content: ParsedContent          // 解析后的内容数组
  bgColor?: string | null         // 背景颜色
  bgImage?: string | null         // 背景渐变图
  colors?: string[]               // 每行文字颜色
  accentColors?: string[]         // 每行强调文字颜色
  aligns?: string[]               // 每行对齐方式
  verticalAligns?: string[]       // 垂直对齐方式
  fontSizes?: string[]            // 每行字号
  iconSizes?: number[]            // 每行图标大小
  fontFamily?: string             // 字体
  padding?: string                // 内边距
  textWrapBgColor?: string        // 文字包裹背景色
  textWrapShadow?: string         // 文字包裹阴影
  textWrapPadding?: string        // 文字包裹内边距
  textWrapRounded?: string        // 文字包裹圆角
}
```

### Content 数据结构

```typescript
type LinePart = Array<{
  text: string
  type: 'text' | 'emoji' | 'accent'  // 普通文字 | Emoji | 强调文字
  base64URL?: string | null          // Emoji 的 base64 图片
}>

type ParsedContent = LinePart[]  // 多行内容
```

**示例**：
```json
[
  [
    {"text": "能力强的人用", "type": "text"},
    {"text": "AI", "type": "accent"},
    {"text": "更强", "type": "text"}
  ]
]
```

## 调试技巧

### 1. 使用 SVG 格式预览

访问 API 时添加 `?format=svg` 查看生成的 SVG：
```
http://localhost:4573/006/default?format=svg
```

### 2. 检查模板是否被正确导入

在 `server/utils/image.ts` 中添加日志：
```typescript
console.log('Available templates:', Object.keys(templateStrings))
console.log('Requested template:', template)
console.log('Template string:', templateString.substring(0, 100))
```

### 3. 验证 Props

在模板字符串开头添加临时调试：
```html
<div class="flex">{{ JSON.stringify({ bgColor, colors, fontSizes }) }}</div>
```

## 常见问题

### Q: 为什么不直接用 `.vue` 文件？

A: Satori 不支持导入 Vue 组件，只能接受纯字符串模板。

### Q: 前端的 `components/template/*.vue` 文件有什么用？

A: 这些文件是历史遗留代码，目前没有实际用途。未来可能会用于前端预览页面。

### Q: 如何让模板支持文字换行？

A: 使用 `flex-wrap` 并设置 `line-height`：
```html
<div :class="['flex font-bold flex-wrap', aligns[lineIdx]]" 
  :style="{ lineHeight: '1.3' }">
  ...
</div>
```

### Q: 如何添加高亮背景框？

A: 使用 `backgroundColor` 和 `padding`：
```html
<span v-else-if="part.type === 'accent'" class="flex"
  :style="{ 
    backgroundColor: accentColors[lineIdx] || '#4CAF50', 
    padding: '4px 8px', 
    margin: '0 4px', 
    borderRadius: '4px' 
  }">
  {{ part.text }}
</span>
```

## 相关文件

- `server/utils/image.ts` - 模板注册和图片生成逻辑
- `server/utils/satori.ts` - Satori 渲染函数
- `lib/content.ts` - Content 解析和 Props 类型定义
- `presets/*.json` - 预设配置文件
- `.opencode/skills/imgx-template-generator/SKILL.md` - AI 模板生成指南
