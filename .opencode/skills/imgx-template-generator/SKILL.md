# IMGX Template Generator Skill

## 技能描述

生成符合 Satori 渲染约束的 IMGX 模板，将文本转换为精美的卡片图片。

## ⚠️ 重要架构说明

### 1. 模板字符串是唯一的真相源

**IMGX 项目只使用模板字符串（template strings）来生成图片**：

- ✅ **实际使用**: `server/templates/[Name].ts` - 导出模板字符串常量
- ✅ **实际使用**: `server/utils/image.ts` - 注册模板到 `templateStrings` 对象
- ✅ **实际使用**: `presets/[code].json` - 配置默认属性

**为什么只用模板字符串？**
- Satori 库只能接受纯字符串，无法导入 `.vue` 文件
- 渲染流程：模板字符串 → Satori 转 SVG → Resvg 转 PNG

### 2. 历史遗留代码（已废弃，不使用）

以下文件/目录是历史遗留物，**在实际渲染中不被使用**：

- ❌ `components/template/*.vue` - Vue 组件文件（未使用）
- ❌ `lib/template.ts` - 模板注册代码（未使用）

**不要创建或修改这些文件** - 它们会导致混淆且不会影响实际功能。

### 3. 正确的模板创建流程

```
1. 创建 server/templates/[Name].ts
   ↓
2. 在 server/utils/image.ts 中导入并注册
   ↓
3. 创建 presets/[code].json 配置
   ↓
4. 测试 http://localhost:4573/[code]/[content]
```

**仅需 3 个文件即可完成模板创建**。

---

## 核心知识

### Satori 库约束

#### 必须做到

1. **每个 `<div>` 必须有 `display: flex`**
   ```html
   <div class="flex">内容</div>
   ```

2. **根元素必须占满容器**
   ```html
   <div class="w-full h-full flex">...</div>
   ```

3. **使用 Tailwind CSS 类名 + 内联样式**
   ```html
   <div class="flex" :style="{color: colors[0]}">文本</div>
   ```

4. **模板字符串中的插值使用 `\${variable}`**
   ```typescript
   export const MyTemplate = `<div class="flex">\${content}</div>`
   ```

#### 不能使用

- ❌ `box-shadow` (改用 `filter: drop-shadow()` - 也不支持)
- ❌ `transform`, `filter`, `animations`
- ❌ 外部图片（只能用 base64 dataURL）
- ❌ 嵌套 Vue 组件
- ❌ `z-index`（通过 DOM 顺序控制层级）

---

## Props 系统

### 必需属性接口

每个模板必须支持 `componentBaseProps`：

```typescript
interface componentBaseProps {
  content: ParsedContent          // 必需 - 解析后的内容
  bgColor?: string | null         // 背景颜色
  bgImage?: string | null         // 背景图片（渐变/dataURL）
  textWrapBgColor?: string        // 文字包裹背景色
  textWrapPadding?: string        // 文字包裹内边距
  colors?: string[]               // 文本颜色数组
  accentColors?: string[]         // 强调色数组
  aligns?: string[]               // 水平对齐（Tailwind 类名）
  verticalAligns?: string[]       // 垂直对齐
  fontSizes?: string[]            // 字体大小
  iconSizes?: number[]            // 图标大小
  fontFamily?: string             // 字体族
  padding?: string                // 容器内边距
  textWrapShadow?: string         // 文字阴影
  textWrapRounded?: string        // 文字圆角
}
```

### Content 数据结构

```typescript
type ParsedContent = LinePart[][]

interface LinePart {
  text: string
  type: 'text' | 'accent' | 'icon'
  icon?: string  // 仅当 type='icon' 时存在
}
```

**示例**：
```typescript
// URL: /006/能力强的人用*AI*更强
// 解析为：
[
  [
    {text: "能力强的人用", type: "text"},
    {text: "AI", type: "accent"},
    {text: "更强", type: "text"}
  ]
]
```

**Accent 语法**：
- `*text*` → 强调文本（使用 `accentColors`）
- `:icon_name:` → 图标（使用 iconSizes）

---

## 生成步骤

### Step 1: 理解需求

从用户输入中提取：

1. **视觉风格**：颜色、布局、排版
2. **功能需求**：支持多行、图标、强调文本
3. **参考图片**（如有）：分析配色、间距、字体大小

**关键问题**：
- 背景用什么颜色/渐变？
- 文字用什么颜色和大小？
- 强调文本如何高亮（颜色/背景/边框）？
- 布局是居中/左对齐/右对齐？
- 是否需要图标支持？

### Step 2: 选择 Preset Code

**命名规则**：
- `00X` 系列：通用模板（001=Base, 002=ArticleCover）
- `MacFolder`：特殊命名模板

**下一个可用编号**：检查 `presets/` 目录

```bash
ls presets/*.json | sort
# 示例输出：001.json, 002.json, 005.json, 006.json
# 下一个可用：003 或 004 或 007
```

### Step 3: 生成模板文件

#### 3.1 创建 `server/templates/[Name].ts`

**文件格式**：
```typescript
// server/templates/CleanTitle.ts
export const CleanTitleTemplate = `<div class="w-full h-full flex flex-col items-center justify-center" :style="{
  backgroundColor: bgColor,
  backgroundImage: bgImage,
  padding: padding,
  fontFamily: fontFamily
}">
  <div 
    v-for="(line, lineIndex) in content" 
    :key="lineIndex"
    class="flex flex-wrap items-center"
    :class="aligns[lineIndex % aligns.length]"
  >
    <template v-for="(part, partIndex) in line" :key="partIndex">
      <span 
        v-if="part.type === 'text'"
        :style="{
          color: colors[lineIndex % colors.length],
          fontSize: fontSizes[lineIndex % fontSizes.length],
          fontWeight: 'bold'
        }"
      >{{ part.text }}</span>
      
      <span 
        v-else-if="part.type === 'accent'"
        class="flex"
        :style="{
          color: '#ffffff',
          backgroundColor: accentColors[lineIndex % accentColors.length],
          fontSize: fontSizes[lineIndex % fontSizes.length],
          fontWeight: 'bold',
          padding: '8px 16px',
          borderRadius: '8px'
        }"
      >{{ part.text }}</span>
    </template>
  </div>
</div>`
```

**模板编写清单**：
- [ ] 根 div 包含 `w-full h-full flex`
- [ ] 所有 div 都有 `class="flex"`
- [ ] 使用 `:style` 绑定动态样式
- [ ] 用 `v-for` 遍历 content（支持多行）
- [ ] 区分 `part.type === 'text'` 和 `part.type === 'accent'`
- [ ] 使用数组索引模运算循环应用样式
- [ ] 插值使用 `\${variable}` 格式
- [ ] 避免使用 Satori 不支持的 CSS 属性

#### 3.2 更新 `server/utils/image.ts`

**添加导入**：
```typescript
// 在文件顶部添加
import { CleanTitleTemplate } from '../templates/CleanTitle'
```

**注册模板**：
```typescript
// 在 templateStrings 对象中添加
const templateStrings: Record<string, string> = {
  'Base': BaseTemplate,
  '001': BaseTemplate,
  'ArticleCover': ArticleCoverTemplate,
  'MacFolder': MacFolderTemplate,
  'CleanTitle': CleanTitleTemplate,  // ← 新增
}
```

**注意**：
- 导入的常量名必须与导出的名字一致
- 对象 key 可以是 preset code 或模板名
- 同一个模板可以有多个 key（如 '001' 和 'Base' 都指向 BaseTemplate）

#### 3.3 创建 `presets/[code].json`

**完整示例**：
```json
{
  "code": "006",
  "name": "Clean Title",
  "size": {
    "width": 1200,
    "height": 510
  },
  "ratio": "2.35:1",
  "template": "CleanTitle",
  "contentProps": {
    "content": [
      [
        { "text": "能力强的人用", "type": "text" },
        { "text": "AI", "type": "accent" },
        { "text": "更强", "type": "text" }
      ]
    ]
  },
  "styleProps": {
    "bgColor": "#FFF8DC",
    "bgImage": "linear-gradient(to right, transparent, transparent)",
    "textWrapBgColor": "transparent",
    "textWrapPadding": "0px",
    "colors": ["#000000"],
    "accentColors": ["#4CAF50"],
    "fontSizes": ["64px"],
    "aligns": ["justify-center"],
    "verticalAligns": ["center"],
    "fontFamily": "YouSheBiaoTiHei",
    "padding": "60px"
  }
}
```

**Preset 文件清单**：
- [ ] `code` 与文件名一致（如 006.json → "code": "006"）
- [ ] `template` 指向 `server/utils/image.ts` 中的 key
- [ ] `size` 定义图片尺寸
- [ ] `ratio` 描述宽高比（非功能性，仅标注）
- [ ] `contentProps.content` 提供默认内容示例
- [ ] `styleProps` **必须包含所有必需字段**（见下方列表）

**必需的 styleProps 字段**：
```json
{
  "bgColor": "#FFFFFF",
  "bgImage": "linear-gradient(...)",
  "textWrapBgColor": "transparent",
  "textWrapPadding": "0px",
  "colors": ["#000000"],
  "accentColors": ["#FF0000"],
  "fontSizes": ["48px"],
  "aligns": ["justify-center"],
  "verticalAligns": ["center"],
  "fontFamily": "YouSheBiaoTiHei",
  "padding": "40px"
}
```

**缺少任何字段会导致 Vue 警告**：
```
[Vue warn]: Property "textWrapPadding" was accessed during render but is not defined on instance.
```

---

## 常见模式

### 多行文本布局

```html
<div class="w-full h-full flex flex-col items-center justify-center">
  <div 
    v-for="(line, lineIndex) in content" 
    :key="lineIndex"
    class="flex flex-wrap"
    :class="aligns[lineIndex % aligns.length]"
  >
    <!-- 行内内容 -->
  </div>
</div>
```

### 文本 + Accent 混合

```html
<template v-for="(part, partIndex) in line" :key="partIndex">
  <span v-if="part.type === 'text'" :style="{color: colors[0]}">
    {{ part.text }}
  </span>
  <span v-else-if="part.type === 'accent'" :style="{color: accentColors[0]}">
    {{ part.text }}
  </span>
</template>
```

### Accent 样式变体

**纯颜色高亮**：
```html
<span :style="{color: accentColors[0], fontWeight: 'bold'}">
  {{ part.text }}
</span>
```

**背景色盒子**：
```html
<span class="flex" :style="{
  color: '#ffffff',
  backgroundColor: accentColors[0],
  padding: '8px 16px',
  borderRadius: '8px'
}">{{ part.text }}</span>
```

**带边框**：
```html
<span class="flex" :style="{
  color: accentColors[0],
  border: '2px solid ' + accentColors[0],
  padding: '4px 12px',
  borderRadius: '4px'
}">{{ part.text }}</span>
```

### 背景渐变

```json
{
  "bgColor": null,
  "bgImage": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
}
```

**可用渐变方向**：
- `to right`, `to left`, `to bottom`, `to top`
- `135deg`, `45deg`, `90deg`

**多色渐变**：
```json
"bgImage": "linear-gradient(to right, #ff6b6b, #feca57, #48dbfb, #ff9ff3)"
```

### 图标支持（可选
