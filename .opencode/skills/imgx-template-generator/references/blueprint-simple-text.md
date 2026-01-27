# 蓝图：简单文本模板

## 📋 适用场景

- ✅ 单行或多行纯文本，无特殊效果
- ✅ 简单居中或对齐布局
- ✅ 统一的文字颜色、大小、字体
- ✅ 适合快速生成基础卡片（名片、标签、简单标题）
- ✅ 不需要强调、图标、背景渐变等复杂特性

---

## 📐 完整模板代码

```typescript
// server/templates/SimpleText.ts
export const SimpleTextTemplate = `<div class="w-full h-full flex flex-col items-center justify-center" :style="{
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
    <span 
      :style="{
        color: colors[lineIndex % colors.length],
        fontSize: fontSizes[lineIndex % fontSizes.length],
        fontWeight: 'normal'
      }"
    >{{ line }}</span>
  </div>
</div>`
```

---

## ⚙️ 注册模板

```typescript
// server/utils/image.ts
import { SimpleTextTemplate } from '../templates/SimpleText'

const templateStrings: Record<string, string> = {
  // ... 其他模板
  'SimpleText': SimpleTextTemplate,  // ← 新增
}
```

---

## 📦 Preset 配置

```json
{
  "code": "010",
  "name": "Simple Text",
  "size": {
    "width": 1200,
    "height": 630
  },
  "ratio": "1.91:1",
  "template": "SimpleText",
  "contentProps": {
    "content": [
      "简单文本卡片",
      "支持多行内容"
    ]
  },
  "styleProps": {
    "bgColor": "#FFFFFF",
    "bgImage": "linear-gradient(to right, transparent, transparent)",
    "textWrapBgColor": "transparent",
    "textWrapPadding": "0px",
    "colors": ["#000000"],
    "accentColors": ["#4CAF50"],
    "fontSizes": ["64px", "48px"],
    "aligns": ["justify-center"],
    "verticalAligns": ["center"],
    "fontFamily": "YouSheBiaoTiHei",
    "padding": "60px"
  }
}
```

### 关键字段说明

| 字段 | 作用 | 示例值 |
|------|------|--------|
| `colors` | **文本颜色** | `["#000000", "#333333"]` |
| `fontSizes` | 文字大小（按行循环） | `["64px", "48px"]` |
| `aligns` | 对齐方式（按行循环） | `["justify-center", "justify-start"]` |

---


---

## 📏 字号选择指南

**设计原则：文字应填充画布，图标或 SVG 仅作为点缀和装饰，不应该有大量空白区域。**

根据实际测试和用户反馈，字号应该根据文字字数动态调整：

| 文字字数 | 推荐字号 | 示例 | 使用场景 |
|---------|---------|------|----------|
| 1-6字 | 140-160px | "使用AI" | 极短标题，需要强视觉冲击 |
| **7-10字** | **100-120px** | **"能力强的人用AI更强"** ✅ | **文章封面短标题（已测试）** |
| 11-15字 | 80-100px | "深入理解Vue3组合式API" | 中等长度标题 |
| 16-25字 | 60-80px | "如何在Nuxt4项目中集成..." | 较长标题，单行显示 |
| 26+字 | 48-60px | 长文本或多行内容 | 多行文本卡片 |

### 字号选择原则

1. **以文字为主**：文字应该是画面的主体，而非装饰
2. **填充画布**：合理的字号应该让文字占据画布的主要区域
3. **避免空白**：如果文字周围有大量空白，说明字号太小
4. **实际测试**：建议在实际尺寸下测试字号效果

### 常见错误示例

❌ **字号过小**：10字以内的标题使用 64px
- 问题：文字周围空白过多，不够醒目
- 解决：使用 100-120px

❌ **字号过大**：30字的内容使用 100px
- 问题：文字溢出或折行过多
- 解决：使用 48-60px，或改为多行布局

### 不同比例的字号建议

| 画布比例 | 尺寸 | 短标题(7-10字) | 中等(11-15字) | 长标题(16+字) |
|---------|------|---------------|--------------|--------------|
| 2.35:1 | 1200×510 | 100-120px | 80-100px | 60-80px |
| 2.35:1 | 1410×600 | 120-140px | 90-110px | 70-90px |
| 1.91:1 | 1200×630 | 90-110px | 70-90px | 50-70px |
| 3:4 | 1080×1440 | 80-100px | 60-80px | 48-60px |
| 16:9 | 1920×1080 | 100-120px | 80-100px | 60-80px |
| 1:1 | 1080×1080 | 80-100px | 60-80px | 48-60px |

**💡 提示**：以上数据基于用户实际测试和反馈，适用于优设标体黑字体。其他字体可能需要微调。

## 🎨 样式变体

### 变体 1: 深色背景 + 白色文字

```json
{
  "bgColor": "#1A1A1A",
  "colors": ["#FFFFFF"],
  "fontSizes": ["72px"]
}
```

**效果：** 深色背景，白色粗体文字，高对比

---

### 变体 2: 渐变背景 + 彩色文字

```json
{
  "bgColor": null,
  "bgImage": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "colors": ["#FFFFFF"],
  "fontSizes": ["60px"]
}
```

**效果：** 紫色渐变背景，白色文字

---

### 变体 3: 多行不同颜色

```json
{
  "bgColor": "#FFF8DC",
  "colors": ["#FF5722", "#4CAF50", "#2196F3"],
  "fontSizes": ["56px", "48px", "40px"],
  "aligns": ["justify-center", "justify-center", "justify-center"]
}
```

**效果：** 每行不同颜色和大小

---

### 变体 4: 左对齐布局

```json
{
  "bgColor": "#F5F5F5",
  "colors": ["#333333"],
  "aligns": ["justify-start", "justify-start"],
  "padding": "80px"
}
```

**效果：** 文字左对齐，留出大边距

---

## ⚠️ 常见陷阱

### ❌ 陷阱 1: 忘记处理多行 content

```javascript
// 错误：content 是字符串数组
content = ["第一行", "第二行"]

// 错误的模板：
<span>{{ content }}</span>  // 会输出 "第一行，第二行"

// 正确：
<div v-for="(line, lineIndex) in content" :key="lineIndex">
  <span>{{ line }}</span>
</div>
```

**后果：** 所有内容挤在一行，无法换行

---

### ❌ 陷阱 2: colors 数组不够长

```json
{
  "colors": ["#000000"],
  "fontSizes": ["64px", "48px", "36px"]  // 3种大小
}
```

**模板中访问：**
```html
colors[1 % 1] = colors[0]  // 第2行用第1种颜色
colors[2 % 1] = colors[0]  // 第3行用第1种颜色
```

**解决：** 确保 colors 数组长度与需要的行数匹配，或提供足够的备选颜色

---

### ❌ 陷阱 3: fontSizes 数据类型错误

```json
// 错误：数字而非字符串
"fontSizes": [64, 48, 36]

// 正确：
"fontSizes": ["64px", "48px", "36px"]
```

**后果：** Satori 渲染时无法识别大小单位

---

## 🧪 测试 URL

### 单行文本
```
http://localhost:4573/010/简单文本卡片
```

### 多行文本
```
http://localhost:4573/010/第一行标题/第二行副标题
```

### 带样式参数
```
http://localhost:4573/010/Hello*World?bgColor=%231A1A1A&fontSizes=72px
```

**预期效果：**
- 文字显示正常，无换行问题
- 颜色、大小符合预期
- 背景色正确
- 无 Vue 警告

---

## ✅ 质量检查清单

### 模板文件

- [ ] 导出常量名为 `SimpleTextTemplate`
- [ ] 根元素包含 `w-full h-full flex flex-col`
- [ ] 使用 `v-for` 遍历 content 数组
- [ ] 每行使用 `lineIndex % colors.length` 循环应用颜色
- [ ] 无 `v-if="part.type"` 逻辑（因为是纯文本）

### Preset 文件

- [ ] `template` 字段值为 `"SimpleText"`
- [ ] `contentProps.content` 是字符串数组
- [ ] `styleProps` 包含 colors、fontSizes、aligns
- [ ] colors、fontSizes、aligns 长度一致或能循环覆盖

### 功能测试

- [ ] 访问 `/{code}/default` 正常显示
- [ ] 多行内容正确换行
- [ ] 颜色、大小按预期应用
- [ ] 无 Vue 警告和 Satori 错误
- [ ] 布局对齐符合预期

---

## 📚 相关参考

- [Props 系统](props-system.md) - 理解数组循环用法
- [Satori 约束](satori-constraints.md) - 了解支持的 CSS
- [常见模式](patterns.md) - 多行布局等通用模式
- [强调文本蓝图](blueprint-with-accent.md) - 需要高亮效果时的方案

---

**推荐场景应用：**
- 📝 博客文章封面
- 🎫 简单名片
- 🏷️ 标签卡片
- 📢 公告或通知

---

## 📏 字号选择指南

**设计原则：文字应填充画布，图标或 SVG 仅作为点缀和装饰，不应该有大量空白区域。**

根据实际测试和用户反馈，字号应该根据文字字数动态调整：

| 文字字数 | 推荐字号 | 示例 | 使用场景 |
|---------|---------|------|----------|
| 1-6字 | 140-160px | "使用AI" | 极短标题，需要强视觉冲击 |
| **7-10字** | **100-120px** | **"能力强的人用AI更强"** ✅ | **文章封面短标题（已测试）** |
| 11-15字 | 80-100px | "深入理解Vue3组合式API" | 中等长度标题 |
| 16-25字 | 60-80px | "如何在Nuxt4项目中集成..." | 较长标题，单行显示 |
| 26+字 | 48-60px | 长文本或多行内容 | 多行文本卡片 |

### 字号选择原则

1. **以文字为主**：文字应该是画面的主体，而非装饰
2. **填充画布**：合理的字号应该让文字占据画布的主要区域
3. **避免空白**：如果文字周围有大量空白，说明字号太小
4. **实际测试**：建议在实际尺寸下测试字号效果

### 常见错误示例

❌ **字号过小**：10字以内的标题使用 64px
- 问题：文字周围空白过多，不够醒目
- 解决：使用 100-120px

❌ **字号过大**：30字的内容使用 100px
- 问题：文字溢出或折行过多
- 解决：使用 48-60px，或改为多行布局

### 不同比例的字号建议

| 画布比例 | 尺寸 | 短标题(7-10字) | 中等(11-15字) | 长标题(16+字) |
|---------|------|---------------|--------------|--------------|
| 2.35:1 | 1200×510 | 100-120px | 80-100px | 60-80px |
| 2.35:1 | 1410×600 | 120-140px | 90-110px | 70-90px |
| 1.91:1 | 1200×630 | 90-110px | 70-90px | 50-70px |
| 3:4 | 1080×1440 | 80-100px | 60-80px | 48-60px |
| 16:9 | 1920×1080 | 100-120px | 80-100px | 60-80px |
| 1:1 | 1080×1080 | 80-100px | 60-80px | 48-60px |

**💡 提示**：以上数据基于用户实际测试和反馈，适用于优设标体黑字体。其他字体可能需要微调。
