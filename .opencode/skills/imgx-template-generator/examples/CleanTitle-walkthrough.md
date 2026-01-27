# CleanTitle 模板创建完整演练

本文档展示如何从零创建 `CleanTitle` 模板，包含完整代码、配置、测试流程。

---

## 📋 需求分析

**用户需求**：
> 创建一个简洁的标题卡片，支持高亮关键词，奶油色背景，适合文章封面，宽高比 2.35:1

**需求拆解**：
1. ✅ 单行文本布局
2. ✅ 支持高亮关键词（accent）
3. ✅ 纯色背景（奶油色 #FFF8DC）
4. ✅ 居中对齐
5. ✅ 尺寸：1200×510 (2.35:1 比例)

**选择蓝图**：
根据需求，选择 **[blueprint-with-accent.md](../references/blueprint-with-accent.md)**

---

## 🛠️ 步骤 1：创建模板文件

### 文件路径
```
server/templates/CleanTitle.ts
```

### 完整代码

```typescript
export const CleanTitleTemplate = \`<div class="w-full h-full flex items-center justify-center"
  :style="{ backgroundColor: bgColor ?? 'transparent', backgroundImage: bgImage ?? 'linear-gradient(to right, transparent, transparent)', padding: padding, fontFamily: fontFamily }">
  <div class="flex items-center w-full h-full"
    :style="{ backgroundColor: textWrapBgColor, padding: textWrapPadding, justifyContent: verticalAligns[0] ?? 'center' }">
    <div class="flex flex-col w-full">
      <template v-for="(line, lineIdx) in content" :key="lineIdx">
        <div :class="['flex font-bold flex-wrap', aligns[lineIdx]]" 
          :style="{ color: colors[lineIdx], fontSize: fontSizes[lineIdx], lineHeight: '1.3' }">
          <template v-for="(part, partIdx) in line" :key="partIdx">
            <span v-if="part.type === 'emoji'" class="flex"
              :style="{ width: fontSizes[lineIdx], height: fontSizes[lineIdx], backgroundImage: \\`url(\\${part.base64URL})\\`, backgroundSize: '100% 100%' }"></span>
            <span v-else-if="part.type === 'accent'" class="flex"
              :style="{ color: colors[lineIdx], backgroundColor: accentColors[lineIdx] || '#4CAF50', padding: '4px 8px', margin: '0 4px', borderRadius: '4px' }">
              {{ part.text }}
            </span>
            <span v-else class="flex">
              {{ part.text }}
            </span>
          </template>
        </div>
      </template>
    </div>
  </div>
</div>\`
```

### 代码解析

#### 1. 根容器（背景层）
```html
<div class="w-full h-full flex items-center justify-center"
  :style="{ backgroundColor: bgColor ?? 'transparent', 
            backgroundImage: bgImage ?? 'linear-gradient(to right, transparent, transparent)', 
            padding: padding, 
            fontFamily: fontFamily }">
```
- ✅ \`w-full h-full flex\` - 满足 Satori 约束
- ✅ \`items-center justify-center\` - 垂直水平居中
- ✅ \`backgroundColor\` - 背景颜色（#FFF8DC 奶油色）
- ✅ \`backgroundImage\` - 预留渐变功能
- ✅ \`padding\` - 整体内边距（60px）

#### 2. 文字容器（包裹层）
```html
<div class="flex items-center w-full h-full"
  :style="{ backgroundColor: textWrapBgColor, 
            padding: textWrapPadding, 
            justifyContent: verticalAligns[0] ?? 'center' }">
```
- ✅ \`flex items-center\` - 垂直居中
- ✅ \`textWrapBgColor\` - 文字背景色（此模板为 transparent）
- ✅ \`textWrapPadding\` - 文字内边距
- ✅ \`justifyContent\` - 水平对齐方式

#### 3. 多行文本循环
```html
<div class="flex flex-col w-full">
  <template v-for="(line, lineIdx) in content" :key="lineIdx">
```
- ✅ \`flex flex-col\` - 纵向排列多行文本
- ✅ \`v-for="(line, lineIdx) in content"\` - 遍历每行内容

#### 4. 单行文本样式
```html
<div :class="['flex font-bold flex-wrap', aligns[lineIdx]]" 
  :style="{ color: colors[lineIdx], 
            fontSize: fontSizes[lineIdx], 
            lineHeight: '1.3' }">
```
- ✅ \`flex font-bold flex-wrap\` - Flexbox + 粗体 + 自动换行
- ✅ \`aligns[lineIdx]\` - 对齐方式（justify-center）
- ✅ \`colors[lineIdx]\` - 文字颜色（#000000）
- ✅ \`fontSizes[lineIdx]\` - 字号（64px）
- ✅ \`lineHeight: '1.3'\` - 行高，避免文字太挤

#### 5. 文本片段渲染（关键！）
```html
<template v-for="(part, partIdx) in line" :key="partIdx">
  <span v-if="part.type === 'emoji'" class="flex"
    :style="{ width: fontSizes[lineIdx], 
              height: fontSizes[lineIdx], 
              backgroundImage: \\`url(\\${part.base64URL})\\`, 
              backgroundSize: '100% 100%' }"></span>
  <span v-else-if="part.type === 'accent'" class="flex"
    :style="{ color: colors[lineIdx], 
              backgroundColor: accentColors[lineIdx] || '#4CAF50', 
              padding: '4px 8px', 
              margin: '0 4px', 
              borderRadius: '4px' }">
    {{ part.text }}
  </span>
  <span v-else class="flex">
    {{ part.text }}
  </span>
</template>
```
- ✅ **三种片段类型**：
  - \`emoji\` - 图标（base64 背景图）
  - \`accent\` - 高亮文字（绿色背景框）
  - \`text\` - 普通文字
- ✅ **高亮效果**：\`backgroundColor + padding + margin + borderRadius\`

---

## ⚙️ 步骤 2：注册模板

### 文件路径
```
server/utils/image.ts
```

### 添加导入
```typescript
import { CleanTitleTemplate } from '../templates/CleanTitle'
```

### 注册到 templateStrings
```typescript
const templateStrings: Record<string, string> = {
  'Base': BaseTemplate,
  '001': BaseTemplate,
  'ArticleCover': ArticleCoverTemplate,
  'MacFolder': MacFolderTemplate,
  'CleanTitle': CleanTitleTemplate,  // ← 新增
}
```

---

## 📦 步骤 3：创建预设配置

### 文件路径
```
presets/006.json
```

### 完整配置

```json
{
  "code": "006",
  "name": "Clean Title - 2.35:1",
  "description": "简洁标题卡片，支持高亮文字，奶油色背景，适合文章封面",
  "template": "CleanTitle",
  "width": 1200,
  "height": 510,
  "contentProps": {
    "content": [[{"text": "能力强的人用", "type": "text"}, {"text": "AI", "type": "accent"}, {"text": "更强", "type": "text"}]]
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
  },
  "contentKeys": "text"
}
```

---

## 🧪 步骤 4：测试模板

### 测试 URL

#### 1. 使用默认预设
```
http://localhost:4573/006/default
```
**预期结果**：显示 "能力强的人用 AI 更强"（AI 有绿色背景框）

#### 2. 自定义内容
```
http://localhost:4573/006/OpenCode让AI开发更高效
```
**预期结果**：显示 "OpenCode让AI开发更高效"

#### 3. 查看 SVG（调试用）
```
http://localhost:4573/006/default?format=svg
```
**预期结果**：返回 SVG 源代码

#### 4. 自定义样式
```
http://localhost:4573/006/自定义样式?bgColor=%23F0F0F0&fontSizes=80px
```
**预期结果**：灰色背景 + 80px 字号

---

## ✅ 步骤 5：质量检查

### Satori 约束检查
- [x] 所有 \`<div>\` 都包含 \`class="flex"\`
- [x] 根元素有 \`w-full h-full\`
- [x] 没有使用 \`box-shadow\`、\`transform\`、\`filter\`
- [x] 图标使用 base64 DataURL

### 功能检查
- [x] 普通文本正常显示
- [x] 高亮文本有背景框
- [x] 文字居中对齐
- [x] 背景颜色正确
- [x] 字号和字体正确

---

## 🔗 相关参考

- [blueprint-with-accent.md](../references/blueprint-with-accent.md) - 高亮文本蓝图
- [props-system.md](../references/props-system.md) - Props 数据结构详解
- [satori-constraints.md](../references/satori-constraints.md) - Satori 约束规则
- [troubleshooting.md](../references/troubleshooting.md) - 常见问题排查

**创建时间**：2026-01-27
