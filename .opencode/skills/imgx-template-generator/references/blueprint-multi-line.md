# 蓝图：多行布局模板

## 📋 适用场景

- ✅ 多行文本，每行需要不同样式（颜色、大小、对齐）
- ✅ 标题 + 副标题 + 签名的三层结构
- ✅ 列表或菜单式布局（每行一项）
- ✅ 需要通过 `lineIndex % array.length` 实现样式循环
- ✅ 支持行级别的个性化展示（如交替背景、渐进式字号）
- ✅ 典型应用：文章卡片、菜单卡片、时间线等

---

## 📐 完整模板代码

```typescript
// server/templates/MultiLine.ts
export const MultiLineTemplate = `<div class="w-full h-full flex flex-col items-center justify-center" :style="{
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
    :style="{
      marginBottom: lineIndex < content.length - 1 ? '20px' : '0px'
    }"
  >
    <template v-for="(part, partIndex) in line" :key="partIndex">
      <!-- 普通文本 -->
      <span 
        v-if="part.type === 'text'"
        :style="{
          color: colors[lineIndex % colors.length],
          fontSize: fontSizes[lineIndex % fontSizes.length],
          fontWeight: 'normal'
        }"
      >{{ part.text }}</span>
      
      <!-- 强调文本 -->
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
import { MultiLineTemplate } from '../templates/MultiLine'

const templateStrings: Record<string, string> = {
  // ... 其他模板
  'MultiLine': MultiLineTemplate,  // ← 新增
}
```

---

## 📦 Preset 配置

```json
{
  "code": "011",
  "name": "Multi-Line Layout",
  "size": {
    "width": 1200,
    "height": 800
  },
  "ratio": "3:4",
  "template": "MultiLine",
  "contentProps": {
    "content": [
      [
        { "text": "第一行标题", "type": "text" }
      ],
      [
        { "text": "第二行：", "type": "text" },
        { "text": "强调词", "type": "accent" }
      ],
      [
        { "text": "第三行信息", "type": "text" }
      ]
    ]
  },
  "styleProps": {
    "bgColor": "#F9F9F9",
    "bgImage": "linear-gradient(to right, transparent, transparent)",
    "textWrapBgColor": "transparent",
    "textWrapPadding": "0px",
    "colors": ["#333333", "#666666", "#999999"],
    "accentColors": ["#FF5722", "#2196F3"],
    "fontSizes": ["64px", "48px", "32px"],
    "aligns": ["justify-center", "justify-center", "justify-center"],
    "verticalAligns": ["center"],
    "fontFamily": "YouSheBiaoTiHei",
    "padding": "60px"
  }
}
```

### 关键字段说明

| 字段 | 作用 | 示例值 |
|------|------|--------|
| `colors` | **每行文本颜色（循环）** | `["#333", "#666", "#999"]` |
| `fontSizes` | 每行字号（循环） | `["64px", "48px", "32px"]` |
| `aligns` | 每行对齐方式（循环） | `["justify-center", "justify-start"]` |
| `content` | **嵌套数组：行 → 段落** | `[[part1], [part2, part3]]` |

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

### 变体 1: 渐进式字号（逐行递减）

```json
{
  "fontSizes": ["80px", "56px", "40px", "28px"],
  "colors": ["#1A1A1A", "#333333", "#666666", "#999999"]
}
```

**效果：** 标题逐行变小，颜色逐行变淡

---

### 变体 2: 交替背景色

```html
<div 
  v-for="(line, lineIndex) in content" 
  :key="lineIndex"
  class="flex flex-wrap w-full"
  :style="{
    backgroundColor: lineIndex % 2 === 0 ? '#FFFFFF' : '#F5F5F5',
    padding: '12px 20px'
  }"
>
  <!-- 行内容 -->
</div>
```

**效果：** 奇偶行背景色不同，类似表格

---

### 变体 3: 左对齐 + 边距渐变

```json
{
  "aligns": ["justify-start", "justify-start", "justify-end"],
  "colors": ["#000000", "#333333", "#999999"],
  "fontSizes": ["56px", "40px", "24px"]
}
```

**效果：** 第一二行左对齐，第三行右对齐（签名效果）

---

### 变体 4: 彩虹渐变（多色轮转）

```json
{
  "colors": ["#FF5722", "#FF9800", "#4CAF50", "#2196F3", "#9C27B0"],
  "fontSizes": ["48px"],
  "aligns": ["justify-center"]
}
```

**效果：** 每行循环使用不同颜色

---

## ⚠️ 常见陷阱

### ❌ 陷阱 1: content 结构错误

```javascript
// 错误：一维数组
content = ["第一行", "第二行"]

// 正确：二维数组（行 → 段落）
content = [
  [{ text: "第一行", type: "text" }],
  [{ text: "第二行", type: "text" }]
]
```

**后果：** 无法正确遍历，模板渲染失败

---

### ❌ 陷阱 2: 循环下标计算错误

```javascript
// 错误：直接使用 partIndex
colors[partIndex % colors.length]

// 正确：使用 lineIndex（行级别）
colors[lineIndex % colors.length]
```

**后果：** 颜色按段落应用，而非按行应用，导致样式混乱

---

### ❌ 陷阱 3: 忘记添加行间距

```html
<!-- 错误：多行会紧贴在一起 -->
<div v-for="(line, lineIndex) in content">
  <span>{{ line }}</span>
</div>

<!-- 正确：添加 marginBottom -->
<div 
  v-for="(line, lineIndex) in content"
  :style="{ marginBottom: lineIndex < content.length - 1 ? '20px' : '0px' }"
>
```

**后果：** 行间距过小，不利于阅读

---

### ❌ 陷阱 4: colors/fontSizes 长度不匹配

```json
{
  "colors": ["#000000"],        // 1种颜色
  "fontSizes": ["64px", "48px"] // 2种大小
}
```

**模板中：**
```
第0行：colors[0 % 1] = 黑色，fontSize[0 % 2] = 64px
第1行：colors[1 % 1] = 黑色，fontSize[1 % 2] = 48px  // 大小不同但颜色相同
```

**解决：** 长度不一致也能工作（通过 modulo 循环），但应保持逻辑一致

---

## 🧪 测试 URL

### 三行不同样式
```
http://localhost:4573/011/标题/副标题有*强调*/底部签名
```

### 多行测试
```
http://localhost:4573/011/第一行/第二行/第三行/第四行
```

### 带样式参数
```
http://localhost:4573/011/Hello/World/Test?bgColor=%23F9F9F9&fontSizes=60px,40px,24px
```

**预期效果：**
- 每行独立显示，有行间距
- 颜色、大小按行循环应用
- 对齐方式符合预期
- 无 Vue 警告和 Satori 错误

---

## ✅ 质量检查清单

### 模板文件

- [ ] 导出常量名为 `MultiLineTemplate`
- [ ] 根元素包含 `w-full h-full flex flex-col`
- [ ] 外层 `v-for` 遍历 content（行级）
- [ ] 内层 `v-for` 遍历 line（段落级）
- [ ] 使用 `lineIndex % colors.length` 应用行级样式
- [ ] 添加 `marginBottom` 控制行间距

### Preset 文件

- [ ] `template` 字段值为 `"MultiLine"`
- [ ] `contentProps.content` 是二维数组
- [ ] 内层元素有 `type: "text"` 或 `"accent"`
- [ ] `styleProps` 包含 colors、fontSizes、aligns
- [ ] 三个数组长度逻辑一致

### 功能测试

- [ ] 访问 `/{code}/default` 正常显示
- [ ] 多行内容独立展示（有行间距）
- [ ] 颜色、大小按行循环应用
- [ ] 强调文本正确高亮
- [ ] 无 Vue 警告和 Satori 错误
- [ ] 对齐方式符合预期

---

## 📚 相关参考

- [Props 系统](props-system.md) - 理解二维数组和循环应用
- [常见模式](patterns.md) - 多行文本布局的其他变体
- [简单文本蓝图](blueprint-simple-text.md) - 基础单样式参考
- [强调文本蓝图](blueprint-with-accent.md) - 结合强调效果

---

**推荐场景应用：**
- 📚 文章卡片（标题+摘要+作者）
- 🎨 作品展示卡（标题+描述+标签）
- 💼 个人介绍（姓名+职位+描述）
- 📊 数据卡片（标题+数值+说明）

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

