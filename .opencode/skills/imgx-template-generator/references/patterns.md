# 常见模式库

本文档整理 IMGX 模板开发中的常见设计模式和最佳实践。

---

## 🎯 布局模式

### 多行文本布局

```html
<div class="w-full h-full flex flex-col items-center justify-center">
  <div 
    v-for="(line, lineIndex) in content" 
    :key="lineIndex"
    class="flex flex-wrap"
    :class="aligns[lineIndex % aligns.length]"
  >
    <!-- 行内容 -->
  </div>
</div>
```

**适用场景：** 标题、副标题、签名等分层内容

**关键点：**
- 使用 `v-for` 遍历内容数组
- `lineIndex % array.length` 循环应用样式
- `flex flex-wrap` 支持文本换行

---

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

**适用场景：** 需要高亮部分关键词

**关键点：**
- 内层 `v-for` 遍历行内的段落
- 区分 `type === 'text'` 和 `type === 'accent'`
- `part.text` 包含实际文本内容

---

### 响应式字体大小（渐进式）

```json
{
  "fontSizes": ["80px", "56px", "40px", "28px"]
}
```

```html
:style="{ fontSize: fontSizes[lineIndex % fontSizes.length] }"
```

**效果：** 标题逐行变小，形成视觉层级

**应用：** 标题卡、文章封面

---

### 交替行背景（斑马纹）

```html
<div 
  v-for="(line, lineIndex) in content"
  :style="{
    backgroundColor: lineIndex % 2 === 0 ? '#FFFFFF' : '#F5F5F5',
    padding: '12px 20px'
  }"
>
  <!-- 行内容 -->
</div>
```

**效果：** 奇偶行背景色交替

**应用：** 列表卡、菜单卡

---

### 左对齐 + 右对齐组合

```json
{
  "aligns": ["justify-start", "justify-start", "justify-end"]
}
```

**效果：**
- 第1-2行：左对齐（主内容）
- 第3行：右对齐（签名或副注）

**应用：** 文章卡、笔记卡

---

## 🎨 强调/高亮模式

### 模式 1: 背景色盒子（推荐）

```html
<span class="flex" :style="{
  color: '#ffffff',
  backgroundColor: accentColors[0],
  padding: '8px 16px',
  borderRadius: '8px'
}">{{ part.text }}</span>
```

**特点：** 高对比、现代、醒目

---

### 模式 2: 纯颜色高亮

```html
<span :style="{
  color: accentColors[0],
  fontWeight: 'bold'
}">{{ part.text }}</span>
```

**特点：** 简洁、轻量级

---

### 模式 3: 带边框

```html
<span class="flex" :style="{
  color: accentColors[0],
  border: '2px solid ' + accentColors[0],
  padding: '4px 12px',
  borderRadius: '4px'
}">{{ part.text }}</span>
```

**特点：** 轻量感、清新风格

---

### 模式 4: 浅底色 + 下划线

```html
<span :style="{
  backgroundColor: 'rgba(' + hexToRgb(accentColors[0]) + ', 0.15)',
  borderBottom: '3px solid ' + accentColors[0],
  paddingBottom: '2px'
}">{{ part.text }}</span>
```

**特点：** 文本标记、书签风格

---

## 🌈 背景模式

### 纯色背景

```json
{
  "bgColor": "#FFFFFF",
  "bgImage": "linear-gradient(to right, transparent, transparent)"
}
```

---

### 线性渐变（常见方向）

```json
{
  "bgImage": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"  // 对角45°
}
```

```json
{
  "bgImage": "linear-gradient(to right, #FF5722 0%, #FFC107 100%)"  // 左→右
}
```

```json
{
  "bgImage": "linear-gradient(to bottom, #667eea 0%, #764ba2 100%)"  // 上→下
}
```

---

### 多色渐变（彩虹）

```json
{
  "bgImage": "linear-gradient(90deg, #FF5722 0%, #FF9800 25%, #4CAF50 50%, #2196F3 75%, #9C27B0 100%)"
}
```

---

### 径向渐变（圆形）

```json
{
  "bgImage": "radial-gradient(circle, #FFD700 0%, #FF8C00 100%)"
}
```

**效果：** 聚焦感强，适合顶部图标或中心元素

---

### 渐变 + 半透明

```json
{
  "bgImage": "linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)",
  "bgColor": "#667eea"
}
```

**效果：** 深度感，保持底层纹理

---

## 📝 文本效果模式

### 文字投影（提升可读性）

```javascript
"textShadow": "0px 2px 4px rgba(0, 0, 0, 0.3)"
```

**用途：** 浅色背景上的深色文字更清晰

---

### 无投影（干净风格）

```javascript
"textShadow": "0px 0px 0px rgba(0, 0, 0, 0)"
```

---

### 深投影（戏剧效果）

```javascript
"textShadow": "0px 8px 16px rgba(0, 0, 0, 0.6)"
```

---

## 🔄 循环应用模式

### 按行循环色彩

```typescript
// 三行内容，三种颜色循环
colors = ["#FF5722", "#4CAF50", "#2196F3"]

// 模板中：
colors[0 % 3] = "#FF5722"  // 第1行
colors[1 % 3] = "#4CAF50"  // 第2行
colors[2 % 3] = "#2196F3"  // 第3行
colors[3 % 3] = "#FF5722"  // 第4行（回到第1种）
```

---

### 按行循环大小

```typescript
fontSizes = ["72px", "48px", "32px"]

// 应用方式相同
fontSizes[lineIndex % fontSizes.length]
```

---

### 按行循环对齐

```typescript
aligns = ["justify-center", "justify-start", "justify-end"]

// 第1行居中，第2行左对齐，第3行右对齐，第4行居中（循环）
```

---

## 📦 Preset 配置模式

### 最小化 Preset（推荐）

```json
{
  "code": "999",
  "name": "Minimal Template",
  "size": { "width": 1200, "height": 630 },
  "template": "SimpleText",
  "contentProps": { "content": ["默认文本"] },
  "styleProps": {
    "bgColor": "#FFF",
    "bgImage": "linear-gradient(to right, transparent, transparent)",
    "colors": ["#000"],
    "fontSizes": ["64px"],
    "aligns": ["justify-center"],
    "fontFamily": "YouSheBiaoTiHei"
  }
}
```

**特点：** 必需字段充分，无冗余

---

### 完整 Preset（标准）

```json
{
  "code": "001",
  "name": "Full Featured",
  "size": { "width": 1200, "height": 630 },
  "ratio": "1.91:1",
  "template": "AccentTemplate",
  "contentProps": { ... },
  "styleProps": {
    "bgColor": "#FFF8DC",
    "bgImage": "linear-gradient(to right, transparent, transparent)",
    "textWrapBgColor": "transparent",
    "textWrapPadding": "0px",
    "colors": ["#000"],
    "accentColors": ["#4CAF50"],
    "fontSizes": ["64px"],
    "aligns": ["justify-center"],
    "verticalAligns": ["center"],
    "fontFamily": "YouSheBiaoTiHei",
    "padding": "60px"
  }
}
```

---

## 🛠️ 高级技巧

### 条件渲染样式

```html
<span :style="{
  color: part.type === 'accent' ? accentColors[0] : colors[0],
  fontWeight: part.type === 'accent' ? 'bold' : 'normal'
}">{{ part.text }}</span>
```

---

### 动态边距

```html
:style="{ marginBottom: lineIndex < content.length - 1 ? '20px' : '0px' }"
```

**效果：** 最后一行无下边距

---

### 计算颜色过渡

```javascript
// 从浓到淡的颜色序列
colors = ["#000", "#333", "#666", "#999", "#CCC"]

// 或使用算法生成
colors = Array(5).fill(null).map((_, i) => {
  const shade = Math.floor(255 * (1 - i / 5))
  return '#' + shade.toString(16).padStart(2, '0').repeat(3)
})
```

---

### 响应式布局（基于行数）

```html
<div 
  :style="{
    fontSize: content.length > 5 ? '32px' : '48px'
  }"
>
  <!-- 行数多时缩小字号 -->
</div>
```

---

## 📋 内容结构模式

### 简单列表（纯文本）

```javascript
content = ["第一行", "第二行", "第三行"]
```

### 多行混合（文本 + 强调）

```javascript
content = [
  [{ text: "能力强的人用", type: "text" }, { text: "AI", type: "accent" }, { text: "更强", type: "text" }]
]
```

### 复杂嵌套（行 + 段落 + 类型）

```javascript
content = [
  [
    { text: "标题", type: "text" },
    { text: "*强调*", type: "accent" }
  ],
  [
    { text: "第二行", type: "text" }
  ]
]
```

---

## 🎯 设计规范

### 常用配色方案

| 方案 | 背景色 | 文本色 | 强调色 | 用途 |
|------|--------|--------|--------|------|
| 清爽 | `#FFF` | `#333` | `#4CAF50` | 文章、笔记 |
| 深色 | `#1A1A1A` | `#FFF` | `#FFD700` | 高端、专业 |
| 渐变 | 渐变 | `#FFF` | `#FF5722` | 社媒、广告 |
| 极简 | `#F5F5F5` | `#666` | `#2196F3` | UI、功能卡 |

---

### 推荐字号

| 用途 | 大小 | 适用场景 |
|------|------|---------|
| 标题 | 64-80px | 顶级信息 |
| 副标题 | 48-56px | 次级信息 |
| 正文 | 32-40px | 核心内容 |
| 签名/备注 | 24-28px | 辅助信息 |

---

### 推荐间距

| 元素 | 间距 | 用途 |
|------|------|------|
| 行间距 | 12-24px | 多行文本 |
| 元素外边距 | 20-40px | 内容两侧 |
| Padding | 60-100px | 整体内容 |

---

## 📚 相关参考

- [蓝图：简单文本](blueprint-simple-text.md) - 基础布局
- [蓝图：多行](blueprint-multi-line.md) - 多层级内容
- [蓝图：强调文本](blueprint-with-accent.md) - 高亮实现
- [蓝图：渐变背景](blueprint-with-gradient.md) - 视觉效果
- [蓝图：图标](blueprint-with-icons.md) - 图文组合

