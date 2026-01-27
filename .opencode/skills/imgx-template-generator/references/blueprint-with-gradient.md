# 蓝图：渐变背景模板

## 📋 适用场景

- ✅ 需要视觉冲击力的卡片（渐变背景更吸引注意）
- ✅ 使用 CSS 渐变实现复杂背景效果
- ✅ 结合纯色 + 渐变的混合背景
- ✅ 支持多色渐变、方向渐变、径向渐变
- ✅ 无需外部图片，纯 CSS 实现，性能优异
- ✅ 典型应用：社交媒体卡片、广告图、品牌宣传卡

---

## 📐 完整模板代码

```typescript
// server/templates/GradientBg.ts
export const GradientBgTemplate = `<div class="w-full h-full flex flex-col items-center justify-center" :style="{
  backgroundColor: bgColor,
  backgroundImage: bgImage,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: padding,
  fontFamily: fontFamily
}">
  <div 
    v-for="(line, lineIndex) in content" 
    :key="lineIndex"
    class="flex flex-wrap items-center"
    :class="aligns[lineIndex % aligns.length]"
    :style="{
      marginBottom: lineIndex < content.length - 1 ? '24px' : '0px'
    }"
  >
    <template v-for="(part, partIndex) in line" :key="partIndex">
      <span 
        v-if="part.type === 'text'"
        :style="{
          color: colors[lineIndex % colors.length],
          fontSize: fontSizes[lineIndex % fontSizes.length],
          fontWeight: 'normal',
          textShadow: textShadow
        }"
      >{{ part.text }}</span>
      
      <span 
        v-else-if="part.type === 'accent'"
        class="flex"
        :style="{
          color: accentColors[lineIndex % accentColors.length],
          fontSize: fontSizes[lineIndex % fontSizes.length],
          fontWeight: 'bold',
          textShadow: textShadow,
          padding: '8px 16px',
          borderRadius: '6px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)'
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
import { GradientBgTemplate } from '../templates/GradientBg'

const templateStrings: Record<string, string> = {
  // ... 其他模板
  'GradientBg': GradientBgTemplate,  // ← 新增
}
```

---

## 📦 Preset 配置

```json
{
  "code": "012",
  "name": "Gradient Background",
  "size": {
    "width": 1200,
    "height": 510
  },
  "ratio": "2.35:1",
  "template": "GradientBg",
  "contentProps": {
    "content": [
      [
        { "text": "渐变背景", "type": "text" },
        { "text": "模板", "type": "accent" }
      ],
      [
        { "text": "视觉冲击力更强", "type": "text" }
      ]
    ]
  },
  "styleProps": {
    "bgColor": "#667eea",
    "bgImage": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "textWrapBgColor": "transparent",
    "textWrapPadding": "0px",
    "colors": ["#FFFFFF"],
    "accentColors": ["#FFD700"],
    "fontSizes": ["64px", "40px"],
    "aligns": ["justify-center", "justify-center"],
    "verticalAligns": ["center"],
    "fontFamily": "YouSheBiaoTiHei",
    "padding": "60px",
    "textShadow": "0px 2px 4px rgba(0, 0, 0, 0.3)"
  }
}
```

### 关键字段说明

| 字段 | 作用 | 示例值 |
|------|------|--------|
| `bgImage` | **CSS 线性/径向渐变** | `"linear-gradient(135deg, ...)"` |
| `bgColor` | 纯色备份（bgImage 失效时） | `"#667eea"` |
| `textShadow` | 文字投影（增强可读性） | `"0px 2px 4px rgba(0,0,0,0.3)"` |
| `colors` | 文本颜色（通常白色） | `["#FFFFFF"]` |

---

## 🎨 渐变方向与效果

### 变体 1: 45° 对角线渐变（推荐）

```json
{
  "bgImage": "linear-gradient(45deg, #FF6B6B 0%, #4ECDC4 100%)"
}
```

**效果：** 从左上红色渐变到右下青色，现代感强

---

### 变体 2: 120° 多色渐变（彩虹）

```json
{
  "bgImage": "linear-gradient(120deg, #FF5722 0%, #FF9800 25%, #4CAF50 50%, #2196F3 75%, #9C27B0 100%)"
}
```

**效果：** 彩虹渐变，五彩缤纷

---

### 变体 3: 从右到左（水平渐变）

```json
{
  "bgImage": "linear-gradient(to left, #1A237E 0%, #6A1B9A 100%)"
}
```

**效果：** 从右侧深蓝到左侧深紫，沉稳大气

---

### 变体 4: 从上到下（垂直渐变）

```json
{
  "bgImage": "linear-gradient(to bottom, #E91E63 0%, #FF5722 100%)"
}
```

**效果：** 从上粉红到下橙红，温暖感强

---

### 变体 5: 径向渐变（圆形）

```json
{
  "bgImage": "radial-gradient(circle, #FFD700 0%, #FF8C00 100%)"
}
```

**效果：** 从中心金色向外扩散到橙色，聚焦感强

---

### 变体 6: 渐变 + 纹理效果

```json
{
  "bgImage": "linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)",
  "bgColor": "#667eea"
}
```

**效果：** 半透明渐变覆盖纯色，层次感强

---

## ⚠️ 常见陷阱

### ❌ 陷阱 1: 忘记文字投影，可读性差

```json
{
  "bgImage": "linear-gradient(135deg, #FFF000 0%, #00FF00 100%)",
  "colors": ["#000000"],
  "textShadow": ""  // ❌ 没有投影
}
```

**效果：** 黑字在黄绿渐变上无法辨认

**解决：** 添加深色投影
```json
{
  "textShadow": "0px 2px 8px rgba(0, 0, 0, 0.5)"
}
```

---

### ❌ 陷阱 2: 渐变语法错误

```json
// 错误：缺少角度或方向
"bgImage": "linear-gradient(#667eea, #764ba2)"

// 正确：必须指定角度或方向
"bgImage": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
```

**后果：** Satori 无法识别，背景为透明或默认色

---

### ❌ 陷阱 3: 颜色渐变点百分比错误

```json
// 错误：百分比不按顺序
"bgImage": "linear-gradient(90deg, red 100%, blue 0%)"

// 正确：百分比应递增
"bgImage": "linear-gradient(90deg, red 0%, blue 100%)"
```

**后果：** 渐变显示不正常

---

### ❌ 陷阱 4: RGB 颜色格式错误

```json
// 错误：使用 rgb() 格式在 linear-gradient 中
"bgImage": "linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))"

// 正确：使用十六进制或 rgba
"bgImage": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
```

**后果：** Satori 可能不支持，渲染失败

---

## 🧪 测试 URL

### 基础渐变测试
```
http://localhost:4573/012/渐变背景*模板*/视觉冲击力更强
```

### 自定义渐变参数
```
http://localhost:4573/012/自定义渐变?bgImage=linear-gradient(45deg,%231A237E,6A1B9A)
```

### 多行渐变背景
```
http://localhost:4573/012/第一行标题/第二行副标题/第三行描述
```

**预期效果：**
- 渐变背景平滑显示
- 文字清晰可读（有投影）
- 强调词汇清晰突出
- 无 Satori 错误

---

## 🎨 渐变组合参考表

| 名称 | 渐变代码 | 使用场景 |
|------|---------|---------|
| 紫色系 | `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` | 创意、设计 |
| 火焰系 | `linear-gradient(45deg, #FF5722 0%, #FF9800 100%)` | 能量、活力 |
| 冰爽系 | `linear-gradient(135deg, #00BCD4 0%, #2196F3 100%)` | 清爽、高科技 |
| 生机系 | `linear-gradient(to right, #4CAF50 0%, #8BC34A 100%)` | 自然、健康 |
| 日落系 | `linear-gradient(to top, #FF6B6B 0%, #FFD93D 100%)` | 浪漫、温暖 |
| 海洋系 | `radial-gradient(circle, #00BCD4 0%, #0277BD 100%)` | 深度、专业 |

---

## ✅ 质量检查清单

### 模板文件

- [ ] 根元素包含 `w-full h-full flex flex-col`
- [ ] 设置 `backgroundImage: bgImage` 和 `backgroundColor: bgColor`
- [ ] 添加 `textShadow` 属性用于文字投影
- [ ] 所有 `<span>` 包含 `textShadow` 绑定
- [ ] 强调文本添加半透明背景盒 `backgroundColor: 'rgba(255,255,255,0.2)'`

### Preset 文件

- [ ] `bgImage` 使用正确的 linear-gradient 或 radial-gradient 语法
- [ ] `bgColor` 与 `bgImage` 的起始色匹配或互补
- [ ] `colors` 为高对比度颜色（通常白色）
- [ ] `textShadow` 提供足够的对比度
- [ ] `styleProps` 包含 `textShadow` 字段

### 功能测试

- [ ] 访问 `/{code}/default` 渐变背景正常显示
- [ ] 文字清晰可读，投影效果符合预期
- [ ] 强调词汇高亮和可读性良好
- [ ] 多行内容布局对齐
- [ ] 无 Satori 错误或警告

---

## 📚 相关参考

- [Satori 约束](satori-constraints.md) - 确认渐变语法支持
- [常见模式](patterns.md) - 背景渐变的通用模式
- [多行布局蓝图](blueprint-multi-line.md) - 结合多行内容
- [强调文本蓝图](blueprint-with-accent.md) - 结合强调效果

---

**推荐场景应用：**
- 🎨 视觉海报
- 📱 社交媒体卡片
- 🎯 品牌宣传
- 🎬 影视推荐
- 💫 创意表达

