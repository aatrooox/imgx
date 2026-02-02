# 蓝图：像素矩阵模板 (Pixel Matrix)

## 📋 适用场景

- ✅ 用像素方格组成字母、数字、图案
- ✅ 像素艺术风格的 Logo、文字
- ✅ 支持纯色填充或 Emoji 表情填充
- ✅ 复古游戏风格封面图
- ✅ **固定预设**：生成后不支持运行时参数修改

---

## ⚠️ 重要说明：固定预设模式

**此蓝图生成的是完全固定的预设，不支持 URL 传参修改内容。**

| 特点 | 说明 |
|------|------|
| **内容固定** | 矩阵数据硬编码在模板常量中 |
| **无动态参数** | `contentKeys` 为空，不接受 URL 路径参数 |
| **每次新设计** | 新的字母/图案需要创建新的预设 |
| **适用场景** | 品牌 Logo、固定标语、装饰性封面 |

---

## 🎨 核心概念：字符矩阵

### 矩阵数据结构

矩阵是一个二维数组，每个单元格可以是：

| 单元格值 | 渲染效果 | 示例 |
|---------|---------|------|
| `''` (空字符串) | 透明 | 字母间隔、背景 |
| `'#FFFFFF'` | 纯色填充 | 白色像素点 |
| `'#FF5722'` | 纯色填充 | 橙色像素点 |
| `'twemoji:cowboy-hat-face'` | Emoji 图标 | 🤠 |

### 示例：字母 "HI" 的矩阵 (5行 x 7列)

```typescript
const HI_MATRIX = [
  ['#FFF', '', '#FFF', '', '#FFF', '#FFF', '#FFF'],  // H顶 + I顶
  ['#FFF', '', '#FFF', '', '', '#FFF', ''],          // H中上 + I中
  ['#FFF', '#FFF', '#FFF', '', '', '#FFF', ''],      // H横杠 + I中
  ['#FFF', '', '#FFF', '', '', '#FFF', ''],          // H中下 + I中
  ['#FFF', '', '#FFF', '', '#FFF', '#FFF', '#FFF'],  // H底 + I底
]
```

**可视化效果：**
```
█ █   █████
█ █     █
█████   █
█ █     █
█ █   █████
```

---

## 📐 完整工作流

### 步骤 1: 设计矩阵数据

在 `server/templates/PixelMatrix.ts` 中添加新的矩阵常量：

```typescript
// 你的自定义矩阵 - 例如 "OK" 字母
export const OK_LETTERS_MATRIX = [
  // O (5列)        空隙    K (5列)
  ['#4CAF50', '#4CAF50', '#4CAF50', '', '#FF9800', '', '', '', '#FF9800'],
  ['#4CAF50', '', '#4CAF50', '', '#FF9800', '', '', '#FF9800', ''],
  ['#4CAF50', '', '#4CAF50', '', '#FF9800', '#FF9800', '#FF9800', '', ''],
  ['#4CAF50', '', '#4CAF50', '', '#FF9800', '', '', '#FF9800', ''],
  ['#4CAF50', '#4CAF50', '#4CAF50', '', '#FF9800', '', '', '', '#FF9800'],
]
```

### 步骤 2: 在 image.ts 中导入并使用

```typescript
// server/utils/image.ts
import { 
  PixelMatrixTemplate, 
  OK_LETTERS_MATRIX  // ← 新增导入
} from '../templates/PixelMatrix'

// 在 generateImage 函数中
if (template === 'PixelMatrix') {
  // 根据 preset code 选择不同的矩阵
  if (preset.code === '106') {
    contentFinalProps.characterMatrix = OK_LETTERS_MATRIX
  } else {
    contentFinalProps.characterMatrix = IMGX_LETTERS_EMOJI_MATRIX
  }
  
  // 处理 emoji 图标转 base64
  const pixelSize = (styleProps as any)?.pixelSize || 20
  const processedMatrix = contentFinalProps.characterMatrix.map((row: any[]) => 
    row.map((cell: any) => {
      if (typeof cell === 'string' && isIconName(cell)) {
        return getBase64IconURL(cell, pixelSize)
      }
      return cell
    })
  )
  contentFinalProps.characterMatrix = processedMatrix
}
```

### 步骤 3: 创建 Preset 文件

```json
// presets/106.json
{
  "code": "106",
  "name": "Pixel Matrix - OK",
  "description": "像素方格矩阵 - OK 字母",
  "width": 1200,
  "height": 510,
  "ratio": "2.35:1",
  "template": "PixelMatrix",
  "contentProps": {},
  "styleProps": {
    "bgColor": "#1a1a2e",
    "fontFamily": "YouSheBiaoTiHei",
    "padding": "60px",
    "pixelSize": 40,
    "pixelGap": 4,
    "pixelRounded": 6
  },
  "contentKeys": ""
}
```

**注意：** `contentKeys` 为空字符串，表示不接受 URL 参数。

---

## 🎯 Emoji 填充模式

### 使用 Emoji 替代纯色

```typescript
export const HELLO_EMOJI_MATRIX = [
  // 使用不同 emoji 表示不同字母
  ['twemoji:beaming-face-with-smiling-eyes', '', 'twemoji:star-struck', ...],
  ...
]
```

### 可用的 Emoji 图标

**仅支持** `assets/icons/twemoji-face-icons.json` 中的图标：

| 图标名称 | 效果 |
|---------|------|
| `twemoji:beaming-face-with-smiling-eyes` | 😁 |
| `twemoji:grinning-face-with-smiling-eyes` | 😄 |
| `twemoji:cowboy-hat-face` | 🤠 |
| `twemoji:star-struck` | 🤩 |
| `twemoji:smiling-face-with-heart-eyes` | 😍 |
| `twemoji:winking-face` | 😉 |
| `twemoji:thinking-face` | 🤔 |
| `twemoji:face-with-tears-of-joy` | 😂 |

**完整列表**：查看 `assets/icons/twemoji-face-icons.json`

---

## 📦 模板代码参考

### PixelMatrixTemplate

```typescript
export const PixelMatrixTemplate = `<div class="w-full h-full flex items-center justify-center"
  :style="{ 
    backgroundColor: bgColor ?? '#1a1a2e', 
    fontFamily: fontFamily ?? 'YouSheBiaoTiHei',
    padding: padding ?? '40px'
  }">
  
  <div class="flex items-center justify-center">
    <div class="flex flex-col" :style="{ gap: (pixelGap ?? 2) + 'px' }">
      <div v-for="(row, rowIdx) in characterMatrix" :key="'char-row-' + rowIdx" 
        class="flex" :style="{ gap: (pixelGap ?? 2) + 'px' }">
        <template v-for="(cell, colIdx) in row" :key="'char-cell-' + rowIdx + '-' + colIdx">
          <!-- Emoji 单元格 (base64 图片) -->
          <div v-if="cell && cell.startsWith && cell.startsWith('data:')"
            class="flex"
            :style="{
              width: (pixelSize ?? 20) + 'px',
              height: (pixelSize ?? 20) + 'px',
              backgroundImage: \`url(\${cell})\`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              borderRadius: (pixelRounded ?? 2) + 'px'
            }">
          </div>
          <!-- 纯色单元格 -->
          <div v-else-if="cell"
            class="flex"
            :style="{
              width: (pixelSize ?? 20) + 'px',
              height: (pixelSize ?? 20) + 'px',
              backgroundColor: cell,
              borderRadius: (pixelRounded ?? 2) + 'px'
            }">
          </div>
          <!-- 透明单元格 -->
          <div v-else
            class="flex"
            :style="{
              width: (pixelSize ?? 20) + 'px',
              height: (pixelSize ?? 20) + 'px',
              backgroundColor: 'transparent'
            }">
          </div>
        </template>
      </div>
    </div>
  </div>
</div>`
```

### 关键点

1. **使用 `<template v-for>`**：允许在循环中使用 `v-if/v-else-if/v-else`
2. **三种单元格类型**：Emoji (data: URL)、纯色、透明
3. **不设置 `backgroundImage: 'none'`**：Satori 不支持该值

---

## ⚙️ StyleProps 配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `bgColor` | string | `#1a1a2e` | 背景颜色 |
| `padding` | string | `40px` | 内边距 |
| `pixelSize` | number | `20` | 每个像素方格的尺寸 (px) |
| `pixelGap` | number | `2` | 像素之间的间距 (px) |
| `pixelRounded` | number | `2` | 像素方格的圆角 (px) |

### 尺寸计算公式

```
总宽度 = 列数 × pixelSize + (列数 - 1) × pixelGap + 2 × padding
总高度 = 行数 × pixelSize + (行数 - 1) × pixelGap + 2 × padding
```

**示例**：23列 × 7行，pixelSize=30，pixelGap=3，padding=60
- 宽度：23×30 + 22×3 + 120 = 690 + 66 + 120 = 876px ✓ (适合 1200px 宽度)
- 高度：7×30 + 6×3 + 120 = 210 + 18 + 120 = 348px ✓ (适合 510px 高度)

---

## 🔧 字母像素图案设计指南

### 标准 5×5 字母模板

适合简单、清晰的字母设计：

```typescript
// 字母 A
const A_5x5 = [
  ['', '#', '#', '#', ''],
  ['#', '', '', '', '#'],
  ['#', '#', '#', '#', '#'],
  ['#', '', '', '', '#'],
  ['#', '', '', '', '#'],
]

// 字母 B
const B_5x5 = [
  ['#', '#', '#', '#', ''],
  ['#', '', '', '', '#'],
  ['#', '#', '#', '#', ''],
  ['#', '', '', '', '#'],
  ['#', '#', '#', '#', ''],
]
```

### 组合多个字母

```typescript
// 组合 "AB"，中间留一列空隙
const AB_MATRIX = [
  [...A_5x5[0], '', ...B_5x5[0]],
  [...A_5x5[1], '', ...B_5x5[1]],
  [...A_5x5[2], '', ...B_5x5[2]],
  [...A_5x5[3], '', ...B_5x5[3]],
  [...A_5x5[4], '', ...B_5x5[4]],
]
```

---

## ⚠️ 常见陷阱

### ❌ 陷阱 1: 使用不存在的 Emoji 图标

```typescript
// ❌ 错误：这些图标不在 twemoji-face-icons.json 中
['twemoji:fire', 'twemoji:rocket', 'twemoji:star']

// ✅ 正确：使用存在的脸部表情
['twemoji:beaming-face-with-smiling-eyes', 'twemoji:cowboy-hat-face']
```

**查看可用图标**：`assets/icons/twemoji-face-icons.json`

### ❌ 陷阱 2: 矩阵行列数不一致

```typescript
// ❌ 错误：第二行只有 4 列，其他行 5 列
const BAD_MATRIX = [
  ['#', '#', '#', '#', '#'],
  ['#', '', '#', ''],       // 缺少一列！
  ['#', '#', '#', '#', '#'],
]

// ✅ 正确：所有行列数一致
const GOOD_MATRIX = [
  ['#', '#', '#', '#', '#'],
  ['#', '', '#', '', ''],   // 用空字符串补齐
  ['#', '#', '#', '#', '#'],
]
```

### ❌ 陷阱 3: 在 v-for 同层级混用 v-if

```html
<!-- ❌ 错误：v-for 和 v-if 在同一个 div 上 -->
<div v-for="cell in row" v-if="cell">

<!-- ✅ 正确：使用 template 包裹 -->
<template v-for="cell in row">
  <div v-if="cell">
```

### ❌ 陷阱 4: 设置 backgroundImage: 'none'

```typescript
// ❌ 错误：Satori 不支持 'none' 值
:style="{ backgroundImage: cell ? \`url(\${cell})\` : 'none' }"

// ✅ 正确：使用 v-if 条件渲染，不设置该属性
<div v-if="isEmoji" :style="{ backgroundImage: \`url(\${cell})\` }">
<div v-else :style="{ backgroundColor: cell }">
```

---

## 🧪 测试方法

```bash
# 启动开发服务器
pnpm dev

# 访问固定预设
http://localhost:4573/api/105/default

# 由于是固定预设，以下 URL 效果相同（忽略参数）
http://localhost:4573/api/105/任何文字
http://localhost:4573/api/105/hello
```

---

## ✅ 质量检查清单

### 矩阵数据

- [ ] 所有行的列数相同
- [ ] Emoji 名称存在于 `twemoji-face-icons.json`
- [ ] 颜色值格式正确 (`#RRGGBB` 或 `#RGB`)
- [ ] 矩阵尺寸适合目标画布

### 模板注册

- [ ] 矩阵常量已导出
- [ ] `image.ts` 中已导入
- [ ] 根据 preset code 选择正确矩阵

### Preset 配置

- [ ] `template` 设为 `"PixelMatrix"`
- [ ] `contentKeys` 为空字符串
- [ ] `pixelSize` 和 `pixelGap` 合理
- [ ] 总尺寸不超过画布

### 渲染测试

- [ ] 访问 `/api/{code}/default` 正常显示
- [ ] 像素清晰，无模糊
- [ ] Emoji 正确显示（如使用）
- [ ] 无 Satori 错误

---

## 📚 相关参考

- [Satori 约束](satori-constraints.md) - 了解 CSS 限制
- [图标模板蓝图](blueprint-with-icons.md) - Emoji 使用说明
- [架构说明](architecture.md) - 模板系统设计

---

## 🎨 设计灵感

| 应用场景 | 设计思路 |
|---------|---------|
| **品牌 Logo** | 用品牌色填充字母 |
| **节日封面** | 用节日主题 emoji 填充 |
| **数字展示** | 显示年份、倒计时 |
| **复古游戏风** | 8-bit 像素艺术 |
| **科技感** | 深色背景 + 霓虹色像素 |
