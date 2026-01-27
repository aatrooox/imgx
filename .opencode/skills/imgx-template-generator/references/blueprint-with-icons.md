# 蓝图：图标模板

## 📋 适用场景

- ✅ 需要在文本旁或上下方显示图标 / Emoji
- ✅ 产品卡片、功能展示卡（带 icon）
- ✅ 支持 base64 dataURL 或 SVG 文本
- ✅ 图标与文字组合展示
- ✅ 典型应用：功能卡片、徽章卡、带 icon 的标题等

---

## 📐 完整模板代码

```typescript
// server/templates/WithIcons.ts
export const WithIconsTemplate = `<div class="w-full h-full flex flex-col items-center justify-center" :style="{
  backgroundColor: bgColor,
  backgroundImage: bgImage,
  padding: padding,
  fontFamily: fontFamily
}">
  <!-- 顶部图标 -->
  <div 
    v-if="topIcon"
    class="flex items-center justify-center"
    :style="{
      marginBottom: '24px'
    }"
  >
    <img 
      :src="topIcon"
      :style="{
        width: iconSizes[0] + 'px',
        height: iconSizes[0] + 'px'
      }"
    />
  </div>

  <!-- 文本内容 -->
  <div 
    v-for="(line, lineIndex) in content" 
    :key="lineIndex"
    class="flex flex-wrap items-center"
    :class="aligns[lineIndex % aligns.length]"
    :style="{
      marginBottom: lineIndex < content.length - 1 ? '12px' : '0px'
    }"
  >
    <!-- 行左侧图标（可选） -->
    <img 
      v-if="lineIcon && lineIndex === 0"
      :src="lineIcon"
      :style="{
        width: iconSizes[1] + 'px',
        height: iconSizes[1] + 'px',
        marginRight: '12px'
      }"
    />

    <!-- 文本和强调 -->
    <template v-for="(part, partIndex) in line" :key="partIndex">
      <span 
        v-if="part.type === 'text'"
        :style="{
          color: colors[lineIndex % colors.length],
          fontSize: fontSizes[lineIndex % fontSizes.length],
          fontWeight: 'normal'
        }"
      >{{ part.text }}</span>
      
      <span 
        v-else-if="part.type === 'accent'"
        class="flex"
        :style="{
          color: accentColors[lineIndex % accentColors.length],
          fontSize: fontSizes[lineIndex % fontSizes.length],
          fontWeight: 'bold'
        }"
      >{{ part.text }}</span>
    </template>
  </div>
</div>`
```

---

## ⚙️ 注册模板

```typescript
// server/utils/image.ts
import { WithIconsTemplate } from '../templates/WithIcons'

const templateStrings: Record<string, string> = {
  // ... 其他模板
  'WithIcons': WithIconsTemplate,  // ← 新增
}
```

---

## 📦 Preset 配置

```json
{
  "code": "013",
  "name": "With Icons",
  "size": {
    "width": 1200,
    "height": 630
  },
  "ratio": "1.91:1",
  "template": "WithIcons",
  "contentProps": {
    "topIcon": "data:image/svg+xml,%3Csvg...",
    "lineIcon": "data:image/svg+xml,%3Csvg...",
    "content": [
      [
        { "text": "功能标题", "type": "text" }
      ],
      [
        { "text": "功能描述内容", "type": "text" }
      ]
    ]
  },
  "styleProps": {
    "bgColor": "#FFFFFF",
    "bgImage": "linear-gradient(to right, transparent, transparent)",
    "textWrapBgColor": "transparent",
    "textWrapPadding": "0px",
    "colors": ["#333333", "#666666"],
    "accentColors": ["#FF5722"],
    "fontSizes": ["56px", "32px"],
    "aligns": ["justify-center", "justify-center"],
    "verticalAligns": ["center"],
    "fontFamily": "YouSheBiaoTiHei",
    "padding": "60px",
    "iconSizes": [80, 40]
  }
}
```

### 关键字段说明

| 字段 | 作用 | 示例值 |
|------|------|--------|
| `topIcon` | **顶部图标（base64 或 SVG）** | `"data:image/svg+xml,%3Csvg..."` |
| `lineIcon` | 行左侧图标 | `"data:image/svg+xml,%3Csvg..."` |
| `iconSizes` | 图标尺寸数组 | `[80, 40]` (顶部, 行左) |

---

## 📝 Base64 图标生成

### 方法 1: 使用在线工具转换

1. 访问 [Base64 Image Converter](https://www.base64-image.de/)
2. 上传 PNG/SVG/JPG 图片
3. 复制 Data URL

```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...
```

### 方法 2: SVG 转 Data URL（推荐）

```javascript
// SVG 原始代码
const svg = `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <circle cx="40" cy="40" r="35" fill="#FF5722"/>
  <text x="40" y="45" text-anchor="middle" font-size="40" fill="white">⭐</text>
</svg>`;

// 转换为 Data URL
const encoded = encodeURIComponent(svg);
const dataUrl = `data:image/svg+xml,%3Csvg...${encoded}`;
```

---

## 🎨 样式变体

### 变体 1: 圆形图标 + 标题

```html
<img 
  :src="topIcon"
  :style="{
    width: '100px',
    height: '100px',
    borderRadius: '50%'  // ⭐ 圆形
  }"
/>
```

**效果：** 圆形图标头像风格

---

### 变体 2: 图标 + 文字并排

```html
<div class="flex items-center justify-center">
  <img 
    :src="lineIcon"
    :style="{ width: '60px', height: '60px', marginRight: '20px' }"
  />
  <span :style="{ fontSize: '48px' }">{{ mainText }}</span>
</div>
```

**效果：** 图标左侧，文字右侧

---

### 变体 3: 图标网格（多图标）

```html
<div class="flex flex-wrap justify-center">
  <img 
    v-for="(icon, idx) in iconList" 
    :key="idx"
    :src="icon"
    :style="{ 
      width: '64px', 
      height: '64px',
      margin: '8px'
    }"
  />
</div>
```

**效果：** 多个图标网格排列

---

### 变体 4: 图标 + 背景圆

```html
<div 
  :style="{
    width: '100px',
    height: '100px',
    backgroundColor: 'rgba(255, 87, 34, 0.1)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }"
>
  <img :src="topIcon" :style="{ width: '70px', height: '70px' }" />
</div>
```

**效果：** 图标在彩色圆形背景上

---

## ⚠️ 常见陷阱

### ❌ 陷阱 1: 使用外部 URL 而非 Base64

```javascript
// ❌ 错误：Satori 无法加载外部 URL
"topIcon": "https://example.com/icon.png"

// ✅ 正确：使用 Base64 Data URL
"topIcon": "data:image/svg+xml,%3Csvg..."
```

**原因：** Satori 在无网络环境运行，只支持 base64

---

### ❌ 陷阱 2: 图标尺寸过大导致溢出

```json
// ❌ 错误：顶部图标过大挤压下面内容
"iconSizes": [400, 200]

// ✅ 正确：合理尺寸
"iconSizes": [80, 40]
```

**解决：** 在模板中测试，确保布局不溢出

---

### ❌ 陷阱 3: SVG 编码错误

```javascript
// ❌ 错误：未正确编码 SVG
"topIcon": "data:image/svg+xml,<svg>...</svg>"

// ✅ 正确：使用 %3C %3E 编码标签
"topIcon": "data:image/svg+xml,%3Csvg%3E...%3C/svg%3E"

// ✅ 或直接使用 Base64
"topIcon": "data:image/svg+xml;base64,PHN2ZyA..."
```

---

### ❌ 陷阱 4: 忘记 `v-if` 检查图标是否存在

```html
<!-- ❌ 错误：topIcon 为空时会报错 -->
<img :src="topIcon" />

<!-- ✅ 正确：检查是否存在 -->
<img v-if="topIcon" :src="topIcon" />
```

---

## 🧪 测试 URL

### 基础图标测试
```
http://localhost:4573/013/功能标题/功能描述
```

### 注意：图标通过 POST 请求或 contentProps 传递

```javascript
// POST 请求示例
fetch('http://localhost:4573/api/image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: '013',
    contentProps: {
      topIcon: 'data:image/svg+xml,%3Csvg...',
      lineIcon: 'data:image/svg+xml,%3Csvg...',
      content: [
        [{ text: '功能标题', type: 'text' }],
        [{ text: '功能描述', type: 'text' }]
      ]
    }
  })
})
```

---

## ✅ 质量检查清单

### 模板文件

- [ ] `topIcon` 和 `lineIcon` 使用 `v-if` 检查
- [ ] `<img>` 标签使用 `:src` 绑定
- [ ] `iconSizes` 数组正确索引
- [ ] 图标尺寸合理，不溢出
- [ ] 图标与文字间距适当

### Preset 文件

- [ ] `contentProps` 包含 `topIcon` 和 `lineIcon`
- [ ] 图标使用 Base64 Data URL 或 SVG 编码
- [ ] `styleProps.iconSizes` 提供两个尺寸值
- [ ] 所有必需的 styleProps 字段存在

### 功能测试

- [ ] 访问 `/{code}/default` 图标正常显示
- [ ] 图标清晰，无模糊或失真
- [ ] 文字与图标布局对齐
- [ ] 无 Satori 错误（尤其是加载图片错误）
- [ ] 响应式适配（不同尺寸显示正常）

---

## 📚 相关参考

- [Satori 约束](satori-constraints.md) - 确认图片支持（仅 base64）
- [Props 系统](props-system.md) - 理解 iconSizes 数组用法
- [常见模式](patterns.md) - 图标与文本混合布局
- [多行布局蓝图](blueprint-multi-line.md) - 基础文本布局参考

---

**推荐场景应用：**
- 🎯 功能卡片（带功能 icon）
- 🏆 成就徽章
- 📦 产品介绍卡
- 🎨 设计作品展示（带 logo）
- 💼 个人简介卡（头像 + 名字）

---

## 🔗 SVG 图标资源

- [Heroicons](https://heroicons.com/) - 开源 SVG icon 库
- [Material Icons](https://fonts.google.com/icons) - 谷歌 Material 图标
- [Font Awesome](https://fontawesome.com/icons) - 专业图标库
- [Feather Icons](https://feathericons.com/) - 简约 SVG 图标

