# IMGX 现有模板对比分析

本文档对比分析现有的 4 个模板（Base、ArticleCover、MacFolder、CleanTitle），帮助开发者选择合适的模板或作为新模板的参考。

---

## 📊 模板总览

| 模板名称 | 预设码 | 适用场景 | 复杂度 | 特色功能 |
|---------|--------|---------|--------|---------|
| **Base** | 001 | 通用卡片 | ⭐ | 基础布局，多行文本 |
| **ArticleCover** | - | 文章封面 | ⭐⭐ | 标题+副标题+作者，支持高亮 |
| **MacFolder** | - | 文件夹图标 | ⭐⭐⭐ | Mac 风格，渐变背景，文件夹图形 |
| **CleanTitle** | 006 | 简洁标题 | ⭐⭐ | 高亮文字，单行布局，奶油色背景 |

---

## 🔍 详细对比

### 1. Base 模板

**文件**：\`server/templates/Base.ts\`  
**预设**：\`presets/001.json\`  
**复杂度**：⭐ 简单

#### 适用场景
- ✅ 多行纯文本
- ✅ 每行不同颜色/大小
- ✅ 简单居中布局
- ❌ 不支持高亮文字
- ❌ 不支持图标

#### 核心特性
```typescript
// 多行文本循环
<template v-for="(line, lineIdx) in content" :key="lineIdx">
  <div :class="['flex font-bold', aligns[lineIdx]]" 
    :style="{ color: colors[lineIdx], fontSize: fontSizes[lineIdx] }">
    {{ line }}  // 每行是简单字符串
  </div>
</template>
```

#### Props 结构
```json
{
  "content": ["第一行", "第二行", "第三行"],  // 字符串数组
  "colors": ["#fff", "#42b883", "#333"],
  "fontSizes": ["48px", "36px", "24px"],
  "aligns": ["justify-center", "justify-center", "justify-end"]
}
```

#### 优点
- ✅ 结构简单，易于理解
- ✅ 适合纯文本场景
- ✅ 性能好（无复杂渲染）

#### 缺点
- ❌ \`content\` 是字符串数组，不支持片段（accent、emoji）
- ❌ 功能单一

#### 何时使用
- 需要快速生成纯文本卡片
- 每行文字样式不同
- 不需要高亮或图标

---

### 2. ArticleCover 模板

**文件**：\`server/templates/ArticleCover.ts\`  
**预设**：无（需自行创建）  
**复杂度**：⭐⭐ 中等

#### 适用场景
- ✅ 文章封面
- ✅ 标题+副标题+作者
- ✅ 支持高亮关键词
- ✅ 渐变背景

#### 核心特性
```html
<div class="flex flex-col w-full h-full items-center justify-center">
  <!-- 标题（支持高亮） -->
  <div class="flex w-full justify-center items-center mb-4">
    <span v-if="title.includes(highlightText)">
      {{ title.split(highlightText)[0] }}
      <span :style="{ color: highlightColor }">{{ highlightText }}</span>
      {{ title.split(highlightText)[1] }}
    </span>
  </div>
  <!-- 副标题 -->
  <div class="flex w-full justify-center items-center mb-6">
    {{ subtitle }}
  </div>
  <!-- 作者 -->
  <div class="flex w-full justify-end items-center">
    {{ author }}
  </div>
</div>
```

#### Props 结构
```json
{
  "title": "深入理解Vue3组合式API及其最佳实践",
  "highlightText": "Vue3",
  "highlightColor": "#42b883",
  "subtitle": "探索现代前端开发的新范式",
  "author": "@前端技术专家",
  "bgColor": "#1e40af",
  "titleColor": "#ffffff",
  "subtitleColor": "#e5e7eb",
  "authorColor": "#e5e7eb"
}
```

#### 优点
- ✅ 固定三段布局（标题/副标题/作者）
- ✅ 支持高亮关键词（颜色变化）
- ✅ 适合文章封面场景

#### 缺点
- ❌ 布局固定，不灵活
- ❌ 高亮只支持颜色变化，无背景框
- ❌ 使用 \`string.split()\` 实现高亮，只能高亮一个词

#### 何时使用
- 需要生成文章封面
- 标题中有关键词需要突出
- 需要显示作者信息

---

### 3. MacFolder 模板

**文件**：\`server/templates/MacFolder.ts\`  
**预设**：无（需自行创建）  
**复杂度**：⭐⭐⭐ 复杂

#### 适用场景
- ✅ Mac 风格文件夹图标
- ✅ 渐变背景
- ✅ SVG 图形绘制

#### 核心特性
```html
<!-- 文件夹图形（SVG path） -->
<svg viewBox="0 0 32 32" width="64" height="64">
  <path d="M28.5,25.8H3.5c-0.6,0-1-0.4-1-1V7.2c0-0.6,0.4-1,1-1h8.9c0.3,0,0.6,0.1,0.8,0.4l1.8,2.4h13.5c0.6,0,1,0.4,1,1v15.8C29.5,25.4,29.1,25.8,28.5,25.8z" fill="currentColor"/>
</svg>
```

#### Props 结构
```json
{
  "folderName": "我的文档",
  "bgGradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "folderColor": "#4A90E2"
}
```

#### 优点
- ✅ 视觉效果独特
- ✅ 适合展示文件夹/分类
- ✅ 渐变背景美观

#### 缺点
- ❌ 结构复杂，难以修改
- ❌ 使用场景单一
- ❌ SVG path 不易调整

#### 何时使用
- 需要生成文件夹图标
- 展示分类或目录
- 需要 Mac 风格视觉

---

### 4. CleanTitle 模板

**文件**：\`server/templates/CleanTitle.ts\`  
**预设**：\`presets/006.json\`  
**复杂度**：⭐⭐ 中等

#### 适用场景
- ✅ 简洁标题卡片
- ✅ 支持高亮文字（背景框）
- ✅ 支持 Emoji 图标
- ✅ 多行布局

#### 核心特性
```html
<template v-for="(part, partIdx) in line" :key="partIdx">
  <!-- Emoji -->
  <span v-if="part.type === 'emoji'" class="flex"
    :style="{ backgroundImage: \`url(\${part.base64URL})\` }"></span>
  <!-- 高亮文字（背景框） -->
  <span v-else-if="part.type === 'accent'" class="flex"
    :style="{ backgroundColor: accentColors[lineIdx], padding: '4px 8px', borderRadius: '4px' }">
    {{ part.text }}
  </span>
  <!-- 普通文字 -->
  <span v-else class="flex">
    {{ part.text }}
  </span>
</template>
```

#### Props 结构
```json
{
  "content": [
    [
      {"text": "能力强的人用", "type": "text"},
      {"text": "AI", "type": "accent"},
      {"text": "更强", "type": "text"}
    ]
  ],
  "colors": ["#000000"],
  "accentColors": ["#4CAF50"],
  "fontSizes": ["64px"],
  "aligns": ["justify-center"]
}
```

#### 优点
- ✅ 支持三种片段类型（text、accent、emoji）
- ✅ 高亮文字有背景框（比 ArticleCover 更明显）
- ✅ 灵活的多行布局
- ✅ 自动换行（\`flex-wrap\`）

#### 缺点
- ❌ Props 结构复杂（二维数组）
- ❌ 需要前端解析 content

#### 何时使用
- 需要高亮关键词（背景框效果）
- 需要显示 Emoji 图标
- 需要灵活的多行布局

---

## 🎯 选择指南

### 场景 1：纯文本多行卡片
**推荐**：Base  
**原因**：结构简单，每行独立配置颜色/大小

### 场景 2：文章封面（标题+副标题+作者）
**推荐**：ArticleCover  
**原因**：固定三段布局，支持高亮关键词

### 场景 3：高亮关键词（明显背景框）
**推荐**：CleanTitle  
**原因**：支持 accent 类型，背景框效果明显

### 场景 4：带图标/Emoji
**推荐**：CleanTitle  
**原因**：支持 emoji 类型，base64 图片渲染

### 场景 5：Mac 风格图标
**推荐**：MacFolder  
**原因**：SVG 图形，渐变背景

---

## 📐 Props 对比

| 模板 | content 结构 | 支持 accent | 支持 emoji | 支持渐变 |
|------|-------------|------------|-----------|---------|
| Base | \`string[]\` | ❌ | ❌ | ✅ |
| ArticleCover | 固定 props | ⚠️ 颜色变化 | ❌ | ✅ |
| MacFolder | 单字符串 | ❌ | ❌ | ✅ |
| CleanTitle | \`LinePart[][]\` | ✅ 背景框 | ✅ | ✅ |

---

## 🔧 技术对比

### 1. Content 数据结构

#### Base（简单字符串数组）
```json
["第一行", "第二行", "第三行"]
```

#### ArticleCover（固定 props）
```json
{
  "title": "...",
  "subtitle": "...",
  "author": "..."
}
```

#### CleanTitle（二维片段数组）
```json
[
  [
    {"text": "能力强的人用", "type": "text"},
    {"text": "AI", "type": "accent"}
  ]
]
```

### 2. 高亮实现方式

#### ArticleCover（字符串分割）
```html
<span v-if="title.includes(highlightText)">
  {{ title.split(highlightText)[0] }}
  <span :style="{ color: highlightColor }">{{ highlightText }}</span>
  {{ title.split(highlightText)[1] }}
</span>
```
- ⚠️ 只能高亮一个词
- ⚠️ 只支持颜色变化

#### CleanTitle（片段遍历）
```html
<span v-else-if="part.type === 'accent'" class="flex"
  :style="{ backgroundColor: accentColors[lineIdx], padding: '4px 8px' }">
  {{ part.text }}
</span>
```
- ✅ 可以高亮多个词
- ✅ 支持背景框

---

## 📝 创建新模板建议

### 基于 Base 扩展
**适合**：需要简单布局，但要添加图标/高亮
**步骤**：将 \`content: string[]\` 改为 \`content: LinePart[][]\`

### 基于 CleanTitle 扩展
**适合**：需要复杂布局，但 CleanTitle 已接近需求
**步骤**：修改容器布局，保留片段渲染逻辑

### 基于 ArticleCover 扩展
**适合**：需要固定三段布局，但要改变样式
**步骤**：修改三段的位置/样式，保留高亮逻辑

### 从零开始
**适合**：需求与现有模板完全不同（如 MacFolder）
**步骤**：参考蓝图文档，从基础布局开始

---

## 🔗 相关文档

- [CleanTitle 完整演练](CleanTitle-walkthrough.md)
- [blueprint-simple-text.md](../references/blueprint-simple-text.md) - 参考 Base 模板
- [blueprint-with-accent.md](../references/blueprint-with-accent.md) - 参考 CleanTitle 模板
- [architecture.md](../references/architecture.md) - 理解模板系统架构

**创建时间**：2026-01-27
