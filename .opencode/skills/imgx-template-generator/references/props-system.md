# Props 系统详解

IMGX 模板通过 Props 接收数据，分为两类：**contentProps**（内容）和 **styleProps**（样式）。

---

## 📦 数据结构

### componentBaseProps 接口

**每个模板必须支持的完整接口：**

```typescript
interface componentBaseProps {
  // 内容（必需）
  content: ParsedContent          // 解析后的文本内容
  
  // 背景样式
  bgColor?: string | null         // 背景颜色
  bgImage?: string | null         // 背景图片（渐变/dataURL）
  
  // 文字包裹样式
  textWrapBgColor?: string        // 文字包裹背景色
  textWrapPadding?: string        // 文字包裹内边距
  textWrapShadow?: string         // 文字阴影（Satori 不支持）
  textWrapRounded?: string        // 文字圆角
  
  // 文本样式
  colors?: string[]               // 文本颜色数组
  accentColors?: string[]         // 强调色数组
  fontSizes?: string[]            // 字体大小数组
  fontFamily?: string             // 字体族
  
  // 布局
  aligns?: string[]               // 水平对齐（Tailwind 类名）
  verticalAligns?: string[]       // 垂直对齐
  padding?: string                // 容器内边距
  
  // 图标（可选）
  iconSizes?: number[]            // 图标大小数组
}
```

---

## 📄 Content 数据结构

### ParsedContent 类型

```typescript
type ParsedContent = LinePart[][]

interface LinePart {
  text: string                    // 文本内容
  type: 'text' | 'accent' | 'icon'  // 类型
  icon?: string                   // 仅当 type='icon' 时存在
}
```

### 示例解析

#### 输入 URL

```
http://localhost:4573/006/能力强的人用*AI*更强
```

#### 解析结果

```typescript
[
  [
    {text: "能力强的人用", type: "text"},
    {text: "AI", type: "accent"},
    {text: "更强", type: "text"}
  ]
]
```

#### URL 语法

- `*text*` → `type: "accent"` （强调文本）
- `:icon_name:` → `type: "icon"` （图标）
- 普通文本 → `type: "text"`

### 多行示例

#### 输入

```
http://localhost:4573/006/第一行/第二行*强调*/第三行
```

#### 解析结果

```typescript
[
  [{text: "第一行", type: "text"}],
  [
    {text: "第二行", type: "text"},
    {text: "强调", type: "accent"}
  ],
  [{text: "第三行", type: "text"}]
]
```

---

## 🎨 styleProps 详解

### 必需字段（所有模板）

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

**缺少任何字段会导致 Vue 警告：**
```
[Vue warn]: Property "textWrapPadding" was accessed during render but is not defined on instance.
```

---

### 字段说明

#### bgColor & bgImage

```json
// 纯色背景
{
  "bgColor": "#FFF8DC",
  "bgImage": "linear-gradient(to right, transparent, transparent)"
}

// 渐变背景
{
  "bgColor": null,
  "bgImage": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
}

// 叠加效果（底色 + 半透明渐变）
{
  "bgColor": "#1a1a1a",
  "bgImage": "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)"
}
```

#### colors（文本颜色数组）

```json
{
  "colors": ["#000000", "#333333", "#666666"]
}
```

**用法：循环应用到每一行**

```html
<div v-for="(line, lineIndex) in content">
  <span :style="{color: colors[lineIndex % colors.length]}">
    {{ part.text }}
  </span>
</div>
```

**示例：**
- 第 1 行 → `colors[0]` → `#000000`
- 第 2 行 → `colors[1]` → `#333333`
- 第 3 行 → `colors[2]` → `#666666`
- 第 4 行 → `colors[0]` → `#000000` (循环)

#### accentColors（强调色数组）

```json
{
  "accentColors": ["#4CAF50", "#FF5722"]
}
```

**用法：应用到 `type="accent"` 的部分**

```html
<span 
  v-else-if="part.type === 'accent'"
  :style="{
    color: '#ffffff',
    backgroundColor: accentColors[lineIndex % accentColors.length]
  }"
>{{ part.text }}</span>
```

#### fontSizes（字体大小数组）

```json
{
  "fontSizes": ["64px", "48px", "36px"]
}
```

**用法：不同行使用不同大小**

```html
<span :style="{fontSize: fontSizes[lineIndex % fontSizes.length]}">
```

#### aligns（水平对齐）

```json
{
  "aligns": ["justify-center", "justify-start", "justify-end"]
}
```

**支持的值：**
- `justify-center` - 居中
- `justify-start` - 左对齐
- `justify-end` - 右对齐
- `justify-between` - 两端对齐
- `justify-around` - 分散对齐

**用法：**

```html
<div 
  v-for="(line, lineIndex) in content"
  :class="aligns[lineIndex % aligns.length]"
>
```

#### verticalAligns（垂直对齐）

```json
{
  "verticalAligns": ["center", "start", "end"]
}
```

**支持的值：**
- `center` - 居中（`items-center`）
- `start` - 顶部（`items-start`）
- `end` - 底部（`items-end`）

#### fontFamily（字体族）

```json
{
  "fontFamily": "YouSheBiaoTiHei"
}
```

**可用字体：**
- `YouSheBiaoTiHei` - 优设标体黑
- `DouyinSansBold` - 抖音美好体

**注意：**
- 必须使用项目已导入的字体
- Satori 需要字体文件的 buffer 数据

#### padding（容器内边距）

```json
{
  "padding": "60px"
}
```

**常用值：**
- `40px` - 紧凑
- `60px` - 标准
- `80px` - 宽松

---

## 🔄 Props 合并机制

### 合并顺序

```
1. Preset 默认值（presets/[code].json）
   ↓
2. URL 参数（query string）
   ↓
3. 最终 Props
```

### 示例

**Preset 默认值：**
```json
{
  "styleProps": {
    "bgColor": "#FFF8DC",
    "fontSizes": ["64px"]
  }
}
```

**URL 请求：**
```
http://localhost:4573/006/测试?bgColor=%23FF0000&fontSizes=72px
```

**最终 Props：**
```json
{
  "bgColor": "#FF0000",     // 被 URL 覆盖
  "fontSizes": ["72px"]     // 被 URL 覆盖
}
```

---

## ⚠️ 常见陷阱

### 1. 遗漏必需字段

```json
// ❌ 错误：缺少 textWrapPadding
{
  "styleProps": {
    "bgColor": "#FFFFFF",
    "colors": ["#000000"]
    // textWrapPadding 缺失
  }
}
```

**后果：**
```
[Vue warn]: Property "textWrapPadding" was accessed during render but is not defined
```

**解决：** 即使不使用，也必须包含所有字段（可设为默认值）

```json
{
  "textWrapPadding": "0px",
  "textWrapBgColor": "transparent"
}
```

---

### 2. 数组索引越界

```html
<!-- ❌ 错误：假设只有一个颜色 -->
<span :style="{color: colors[0]}">
```

**问题：** 如果 `colors` 为空会报错

**解决：** 使用模运算循环

```html
<!-- ✅ 正确 -->
<span :style="{color: colors[lineIndex % colors.length]}">
```

---

### 3. 类型不匹配

```json
// ❌ 错误：fontSizes 应该是字符串数组
{
  "fontSizes": [64, 48]  // 数字
}

// ✅ 正确
{
  "fontSizes": ["64px", "48px"]  // 字符串
}
```

---

## 📋 完整 Preset 示例

```json
{
  "code": "007",
  "name": "My Template",
  "size": {
    "width": 1200,
    "height": 630
  },
  "ratio": "1.91:1",
  "template": "MyTemplate",
  "contentProps": {
    "content": [
      [
        { "text": "示例文本", "type": "text" },
        { "text": "强调", "type": "accent" }
      ]
    ]
  },
  "styleProps": {
    "bgColor": "#FFFFFF",
    "bgImage": "linear-gradient(to right, transparent, transparent)",
    "textWrapBgColor": "transparent",
    "textWrapPadding": "0px",
    "colors": ["#000000"],
    "accentColors": ["#FF5722"],
    "fontSizes": ["48px"],
    "aligns": ["justify-center"],
    "verticalAligns": ["center"],
    "fontFamily": "YouSheBiaoTiHei",
    "padding": "60px"
  }
}
```

---

## 🔗 相关文档

- [架构说明](architecture.md) - 理解 Props 如何传递给模板
- [Satori 约束](satori-constraints.md) - Props 值必须符合 Satori 支持
- [蓝图库](../SKILL.md#选择模板类型) - 查看各类型模板的 Props 用法

---

**记住：所有必需字段必须存在，即使值为空或默认值。**
