# Plan: 像素方格矩阵模板

## 状态：需要优化

用户反馈：
1. 蜡笔小新形象不够像，需要重新设计
2. 不需要支持用户自定义 characterMatrix，只支持固定形象

---

## 待执行的修改

### 修改 1: 更新 server/templates/PixelMatrix.ts

将 SHIN_CHAN_MATRIX 替换为新的 18×14 设计：

```typescript
// 蜡笔小新像素图案 - 18行 x 14列
// 特点：超粗眉毛（最重要！）、小眼睛、圆脸、腮红
// 颜色说明:
// '' = 透明
// '#FFE4C4' = 肤色
// '#000000' = 黑色 (眉毛/眼睛)
// '#FF9999' = 粉红色 (腮红)
// '#3D2914' = 深棕色 (头发)
export const SHIN_CHAN_MATRIX = [
  // Row 1-4: 头发（锯齿状）
  ['', '', '', '', '#3D2914', '#3D2914', '#3D2914', '#3D2914', '#3D2914', '#3D2914', '', '', '', ''],
  ['', '', '', '#3D2914', '#3D2914', '#3D2914', '#3D2914', '#3D2914', '#3D2914', '#3D2914', '#3D2914', '', '', ''],
  ['', '', '#3D2914', '#3D2914', '#3D2914', '#3D2914', '#3D2914', '#3D2914', '#3D2914', '#3D2914', '#3D2914', '#3D2914', '', ''],
  ['', '#3D2914', '#3D2914', '#3D2914', '#3D2914', '#3D2914', '#3D2914', '#3D2914', '#3D2914', '#3D2914', '#3D2914', '#3D2914', '#3D2914', ''],
  
  // Row 5-6: 额头
  ['', '#3D2914', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#3D2914', ''],
  ['', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', ''],
  
  // Row 7-8: ⭐ 超粗眉毛！（核心特征）
  ['#FFE4C4', '#FFE4C4', '#000000', '#000000', '#000000', '#000000', '#FFE4C4', '#FFE4C4', '#000000', '#000000', '#000000', '#000000', '#FFE4C4', '#FFE4C4'],
  ['#FFE4C4', '#FFE4C4', '#000000', '#000000', '#000000', '#000000', '#FFE4C4', '#FFE4C4', '#000000', '#000000', '#000000', '#000000', '#FFE4C4', '#FFE4C4'],
  
  // Row 9: 眉眼间距
  ['#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4'],
  
  // Row 10: 小眼睛（只是小黑点！）
  ['#FFE4C4', '#FFE4C4', '#FFE4C4', '#000000', '#000000', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#000000', '#000000', '#FFE4C4', '#FFE4C4', '#FFE4C4'],
  
  // Row 11: 眼睛下方
  ['#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4'],
  
  // Row 12-13: 腮红 + 鼻子
  ['#FFE4C4', '#FF9999', '#FF9999', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#000000', '#000000', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FF9999', '#FF9999', '#FFE4C4'],
  ['#FFE4C4', '#FF9999', '#FF9999', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FF9999', '#FF9999', '#FFE4C4'],
  
  // Row 14: 嘴巴上方
  ['', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', ''],
  
  // Row 15: 嘴巴
  ['', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#FFE4C4', '#FFE4C4', '#FFE4C4', ''],
  
  // Row 16-18: 下巴
  ['', '', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#000000', '#000000', '#000000', '#000000', '#FFE4C4', '#FFE4C4', '#FFE4C4', '', ''],
  ['', '', '', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '', '', ''],
  ['', '', '', '', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4', '', '', '', ''],
]
```

---

### 修改 2: 更新 server/utils/image.ts

1. 修改导入语句（第7行）：
```typescript
import { PixelMatrixTemplate, SHIN_CHAN_MATRIX } from '../templates/PixelMatrix'
```

2. 在 contentFinalProps 处理后（约第56行），添加自动注入：
```typescript
  // For PixelMatrix template, always use fixed SHIN_CHAN_MATRIX
  if (template === 'PixelMatrix') {
    contentFinalProps.characterMatrix = SHIN_CHAN_MATRIX
  }
```

---

### 修改 3: 简化 presets/105.json

移除 characterMatrix，只保留：
```json
{
  "code": "105",
  "name": "Pixel Matrix - Shin Chan",
  "description": "像素方格矩阵 - 蜡笔小新风格，可显示日期",
  "width": 1200,
  "height": 510,
  "ratio": "2.35:1",
  "template": "PixelMatrix",
  "contentProps": {
    "dateDigits": [
      [["#", "#", "#"], ["", "", "#"], ["#", "#", "#"], ["#", "", ""], ["#", "#", "#"]],
      [["#", "#", "#"], ["#", "", "#"], ["#", "#", "#"], ["", "", "#"], ["#", "#", "#"]],
      [["", "", ""], ["", "", ""], ["", "", ""], ["", "", ""], ["", "#", ""]],
      [["#", "#", "#"], ["", "", "#"], ["", "", "#"], ["", "", "#"], ["", "", "#"]],
      [["#", "#", "#"], ["", "", "#"], ["#", "#", "#"], ["#", "", ""], ["#", "#", "#"]]
    ],
    "titleText": ""
  },
  "styleProps": {
    "bgColor": "#1a1a2e",
    "bgImage": "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    "textWrapBgColor": "transparent",
    "textWrapPadding": "0px",
    "colors": ["#FFFFFF"],
    "accentColors": ["#FFD700"],
    "fontSizes": ["48px"],
    "aligns": ["justify-center"],
    "verticalAligns": ["center"],
    "fontFamily": "YouSheBiaoTiHei",
    "padding": "40px",
    "pixelSize": 20,
    "pixelGap": 2,
    "pixelRounded": 3,
    "datePixelSize": 14,
    "dateColor": "#FFFFFF",
    "titleColor": "#FFFFFF",
    "titleFontSize": "28px"
  },
  "contentKeys": "dateDigits"
}
```

---

## 设计改进说明

| 特征 | 原版 | 新版 |
|------|------|------|
| 尺寸 | 20×16 | 18×14 |
| 眉毛 | 普通 | **超粗**（核心特征）|
| 眼睛 | 带眼白 | 小黑点（更像！）|
| 头发 | #4A3728 | #3D2914（更深）|
| 腮红 | #FF6B6B | #FF9999（更粉）|

---

## 执行命令

使用 `/start-work` 继续执行这些修改。
