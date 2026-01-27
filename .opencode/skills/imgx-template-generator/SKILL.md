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
）

```html
<span v-else-if="part.type === 'icon'" class="flex items-center justify-center">
  <img 
    :src="'/icons/' + part.icon + '.svg'" 
    :style="{width: iconSizes[0] + 'px', height: iconSizes[0] + 'px'}"
  />
</span>
```

**注意**：图标必须是 base64 dataURL 或服务器路径

---

## 调试与测试

### 测试 URL 格式

```
http://localhost:4573/{code}/{content}?{styleParams}
```

**示例**：
```
http://localhost:4573/006/能力强的人用*AI*更强
http://localhost:4573/006/default
http://localhost:4573/006/Hello*World*?bgColor=%23FF0000&fontSizes=72px
```

### 常见错误

#### 1. Vue Property 警告

```
[Vue warn]: Property "textWrapPadding" was accessed during render but is not defined on instance.
```

**解决**：在 preset JSON 的 `styleProps` 中添加缺失字段

#### 2. Satori 渲染失败

```
Error: <span> must have display: flex
```

**解决**：给所有 `<div>` 和 `<span>` 添加 `class="flex"`

#### 3. 样式不生效

**原因**：Satori 不支持该 CSS 属性
**解决**：查阅 Satori 文档，使用支持的属性

#### 4. 模板未找到

```
Error: Template "CleanTitle" not found
```

**解决**：
1. 检查 `server/utils/image.ts` 是否导入
2. 检查 `templateStrings` 对象是否注册
3. 检查 preset JSON 的 `"template"` 字段是否匹配 key

---

## 完整工作流示例

### 需求：创建 "Clean Title" 模板

**用户描述**：
- 奶油色背景（#FFF8DC）
- 黑色粗体文字（64px）
- 强调文本用绿色背景盒子（#4CAF50）
- 居中布局

### 执行步骤

#### 1. 创建模板文件

**文件**: `server/templates/CleanTitle.ts`

```typescript
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

#### 2. 注册模板

**文件**: `server/utils/image.ts`

添加导入：
```typescript
import { CleanTitleTemplate } from '../templates/CleanTitle'
```

注册到对象：
```typescript
const templateStrings: Record<string, string> = {
  'Base': BaseTemplate,
  '001': BaseTemplate,
  'ArticleCover': ArticleCoverTemplate,
  'MacFolder': MacFolderTemplate,
  'CleanTitle': CleanTitleTemplate,
}
```

#### 3. 创建 Preset

**文件**: `presets/006.json`

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

#### 4. 测试

**启动开发服务器**（如未运行）：
```bash
pnpm dev
```

**访问测试 URL**：
```
http://localhost:4573/006/default
http://localhost:4573/006/能力强的人用*AI*更强
```

**验证**：
- ✅ 背景色为奶油色
- ✅ 文字为黑色 64px 粗体
- ✅ "AI" 显示为白字绿底盒子
- ✅ 文字居中显示

---

## 质量检查清单

### 模板文件（server/templates/[Name].ts）

- [ ] 导出命名常量（`export const [Name]Template`）
- [ ] 根元素包含 `w-full h-full flex`
- [ ] 所有 `<div>` 有 `class="flex"`
- [ ] 使用 `v-for` 遍历 content
- [ ] 区分 `text` 和 `accent` 类型
- [ ] 使用 `:style` 绑定动态样式
- [ ] 避免 Satori 不支持的 CSS
- [ ] 插值使用 `\${variable}` 格式

### 注册文件（server/utils/image.ts）

- [ ] 导入语句正确（`import { [Name]Template } from '../templates/[Name]'`）
- [ ] 在 `templateStrings` 对象中注册
- [ ] Key 名与 preset 的 `"template"` 字段匹配

### Preset 文件（presets/[code].json）

- [ ] `code` 与文件名一致
- [ ] `template` 指向正确的模板 key
- [ ] `size` 定义合理（常见：1200×630, 1200×510）
- [ ] `contentProps.content` 提供有效示例
- [ ] `styleProps` 包含所有必需字段：
  - [ ] bgColor
  - [ ] bgImage
  - [ ] textWrapBgColor
  - [ ] textWrapPadding
  - [ ] colors
  - [ ] accentColors
  - [ ] fontSizes
  - [ ] aligns
  - [ ] verticalAligns
  - [ ] fontFamily
  - [ ] padding

### 功能测试

- [ ] 访问 `/{code}/default` 正常显示
- [ ] 文字颜色、大小符合预期
- [ ] Accent 文本高亮效果正确
- [ ] 背景色/渐变正常
- [ ] 布局对齐符合设计
- [ ] 无 Vue 警告
- [ ] 无 Satori 错误

---

## 禁止事项

1. ❌ **不得创建 Vue 组件文件**（`components/template/*.vue`）- 已废弃
2. ❌ **不得修改 `lib/template.ts`** - 已废弃
3. ❌ 不得使用 Satori 不支持的 CSS 属性
4. ❌ 不得在 preset 中遗漏必需的 styleProps 字段
5. ❌ 不得在模板中使用外部图片 URL（仅 base64）
6. ❌ 不得跳过功能测试环节
7. ❌ 不得在 div/span 中省略 `class="flex"`

---

## 高级技巧

### 条件渲染样式

```html
<span class="flex" :style="{
  color: part.type === 'accent' ? accentColors[0] : colors[0],
  fontWeight: part.type === 'accent' ? 'bold' : 'normal'
}">{{ part.text }}</span>
```

### 交替行颜色

```html
<div 
  v-for="(line, lineIndex) in content"
  :style="{
    backgroundColor: lineIndex % 2 === 0 ? 'rgba(0,0,0,0.05)' : 'transparent'
  }"
>
```

### 响应式字体大小

```json
{
  "fontSizes": ["64px", "48px", "36px"]
}
```

模板中：
```html
:style="{fontSize: fontSizes[lineIndex % fontSizes.length]}"
```

### 组合渐变 + 纯色

```json
{
  "bgColor": "#1a1a1a",
  "bgImage": "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)"
}
```

效果：深色底 + 半透明渐变叠加

---

## 参考资源

### 项目内文档

- `server/templates/README.md` - 架构详细说明
- `AGENTS.md` - 项目整体指南
- 现有模板文件：
  - `server/templates/Base.ts`
  - `server/templates/ArticleCover.ts`
  - `server/templates/MacFolder.ts`
  - `server/templates/CleanTitle.ts`

### 外部文档

- [Satori 官方文档](https://github.com/vercel/satori)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Vue 3 模板语法](https://vuejs.org/guide/essentials/template-syntax.html)

---

## 故障排除

### 问题：模板不显示

**检查步骤**：
1. `server/templates/[Name].ts` 是否正确导出？
2. `server/utils/image.ts` 是否正确导入和注册？
3. Preset JSON 的 `"template"` 字段是否匹配？
4. 开发服务器是否重启（`pnpm dev`）？

### 问题：样式不生效

**检查步骤**：
1. 是否使用了 Satori 不支持的 CSS？
2. 所有 div/span 是否有 `class="flex"`？
3. 样式是否用 `:style` 绑定而非 `style` 属性？
4. Preset JSON 是否包含对应的 styleProps 字段？

### 问题：Vue 警告（Property not defined）

**解决方案**：
在 preset JSON 的 `styleProps` 中添加缺失字段，即使值为空字符串或默认值。

**示例**：
```json
{
  "textWrapPadding": "0px",
  "textWrapBgColor": "transparent",
  "verticalAligns": ["center"]
}
```

### 问题：文字不换行

**解决方案**：
在包含文字的 div 上添加 `flex-wrap`：
```html
<div class="flex flex-wrap">
```

---

## 版本历史

- **v2.0** (2026-01-27): 重大重构 - 移除 Vue 组件依赖，采用纯模板字符串架构
- **v1.0** (早期): 初始版本 - 使用 Vue 组件（已废弃）

---

## 总结

**核心原则**：
1. 只创建 `server/templates/[Name].ts` 模板字符串文件
2. 在 `server/utils/image.ts` 中导入并注册
3. 创建完整的 `presets/[code].json` 配置
4. 遵守 Satori 约束（flex 布局、支持的 CSS）
5. 包含所有必需的 styleProps 字段

**成功标准**：
- ✅ 访问 `/{code}/default` 正常显示
- ✅ 样式符合设计要求
- ✅ 无 Vue 警告
- ✅ 无 Satori 错误
- ✅ 代码清晰易维护

**记住**：模板字符串是唯一真相源，不要创建或修改 Vue 组件文件。
