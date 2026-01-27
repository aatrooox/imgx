# 蓝图：强调文本模板

## 📋 适用场景

- ✅ 需要高亮关键词（产品名、专有名词、核心概念）
- ✅ 使用背景色盒子、边框或特殊颜色标记重点
- ✅ 支持 `*text*` 语法自动识别强调内容
- ✅ 典型应用：文章封面、社交媒体卡片、广告标语

---

## 📐 完整模板代码

```typescript
// server/templates/AccentTemplate.ts
export const AccentTemplateTemplate = `<div class="w-full h-full flex flex-col items-center justify-center" :style="{
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
      <!-- 普通文本 -->
      <span 
        v-if="part.type === 'text'"
        :style="{
          color: colors[lineIndex % colors.length],
          fontSize: fontSizes[lineIndex % fontSizes.length],
          fontWeight: 'bold'
        }"
      >{{ part.text }}</span>
      
      <!-- 强调文本 - 背景盒子样式 -->
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

---

## ⚙️ 注册模板

```typescript
// server/utils/image.ts
import { AccentTemplateTemplate } from '../templates/AccentTemplate'

const templateStrings: Record<string, string> = {
  // ... 其他模板
  'AccentTemplate': AccentTemplateTemplate,  // ← 新增
}
```

---

## 📦 Preset 配置

```json
{
  "code": "007",
  "name": "Accent Template",
  "size": {
    "width": 1200,
    "height": 510
  },
  "ratio": "2.35:1",
  "template": "AccentTemplate",
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
    "accentColors": ["#4CAF50"],        // ← 关键：强调色
    "fontSizes": ["64px"],
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
| `accentColors` | **强调文本的颜色** | `["#4CAF50", "#FF5722"]` |
| `colors` | 普通文本的颜色 | `["#000000"]` |
| `fontSizes` | 文字大小 | `["64px"]` |

---

## 🎨 强调样式变体

### 变体 1: 背景盒子（推荐）

```html
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
```

**效果：** 白字 + 彩色背景盒子 + 圆角

**适用：** 强对比、高可读性、现代风格

---

### 变体 2: 纯颜色高亮

```html
<span 
  v-else-if="part.type === 'accent'"
  :style="{
    color: accentColors[lineIndex % accentColors.length],
    fontSize: fontSizes[lineIndex % fontSizes.length],
    fontWeight: 'bold'
  }"
>{{ part.text }}</span>
```

**效果：** 彩色文字 + 粗体（无背景）

**适用：** 简洁风格、文字密集场景

---

### 变体 3: 带边框

```html
<span 
  v-else-if="part.type === 'accent'"
  class="flex"
  :style="{
    color: accentColors[lineIndex % accentColors.length],
    border: '2px solid ' + accentColors[lineIndex % accentColors.length],
    fontSize: fontSizes[lineIndex % fontSizes.length],
    fontWeight: 'bold',
    padding: '4px 12px',
    borderRadius: '4px'
  }"
>{{ part.text }}</span>
```

**效果：** 彩色文字 + 彩色边框 + 无背景

**适用：** 轻量感、清新风格

---

### 变体 4: 下划线/底色

```html
<span 
  v-else-if="part.type === 'accent'"
  class="flex"
  :style="{
    color: colors[lineIndex % colors.length],
    backgroundColor: 'rgba(' + hexToRgb(accentColors[0]) + ', 0.2)',
    fontSize: fontSizes[lineIndex % fontSizes.length],
    fontWeight: 'bold',
    padding: '2px 8px',
    borderBottom: '3px solid ' + accentColors[lineIndex % accentColors.length]
  }"
>{{ part.text }}</span>
```

**效果：** 浅色背景 + 彩色下划线

**适用：** 文本书签、标注风格

---

## ⚠️ 常见陷阱

### ❌ 陷阱 1: 忘记添加 `class="flex"`

```html
<!-- 错误：Satori 会报错 -->
<span v-else-if="part.type === 'accent'" :style="{...}">
  {{ part.text }}
</span>

<!-- 正确：必须有 flex -->
<span v-else-if="part.type === 'accent'" class="flex" :style="{...}">
  {{ part.text }}
</span>
```

**后果：**
```
Error: <span> must have display: flex
```

---

### ❌ 陷阱 2: 在 preset 中遗漏 `accentColors`

```json
{
  "styleProps": {
    "colors": ["#000000"]
    // ❌ 缺少 accentColors
  }
}
```

**后果：**
```
[Vue warn]: Property "accentColors" was accessed during render but is not defined
```

**解决：** 必须包含在 styleProps 中

```json
{
  "styleProps": {
    "colors": ["#000000"],
    "accentColors": ["#4CAF50"]  // ✅ 必须存在
  }
}
```

---

### ❌ 陷阱 3: 使用不支持的 CSS

```html
<!-- ❌ 错误：Satori 不支持 box-shadow -->
<span :style="{
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
}">
```

**解决：** 使用边框模拟阴影

```html
<!-- ✅ 正确 -->
<span :style="{
  border: '1px solid rgba(0,0,0,0.1)',
  borderBottom: '3px solid rgba(0,0,0,0.15)'
}">
```

---

## 🧪 测试 URL

```
http://localhost:4573/007/能力强的人用*AI*更强
                          ^^^^^^^^  ^^ ^^^^
                          普通文本 强调 普通文本
```

### 预期效果

- **"能力强的人用"** → 黑色文字（`colors[0]`）
- **"AI"** → 白字绿底盒子（`accentColors[0]`）
- **"更强"** → 黑色文字（`colors[0]`）

### 多行测试

```
http://localhost:4573/007/第一行/第二行有*强调*词/第三行
```

**预期效果：**
- 第一行：纯黑色
- 第二行："第二行有" 黑色，"强调" 绿底，"词" 黑色
- 第三行：纯黑色

---

## ✅ 质量检查清单

### 模板文件

- [ ] 导出常量名为 `[Name]Template`
- [ ] 根元素包含 `w-full h-full flex`
- [ ] 所有 `<div>` 和 `<span>` 有 `class="flex"`
- [ ] 区分 `part.type === 'text'` 和 `part.type === 'accent'`
- [ ] 使用 `accentColors[lineIndex % accentColors.length]` 循环应用

### Preset 文件

- [ ] `template` 字段指向正确的模板 key
- [ ] `styleProps` 包含 `accentColors` 字段
- [ ] `styleProps` 包含所有 12 个必需字段
- [ ] `contentProps.content` 提供示例（包含 accent 类型）

### 功能测试

- [ ] 访问 `/{code}/*text*` 正常显示强调效果
- [ ] 强调文本样式符合预期（背景/颜色/边框）
- [ ] 多行混合内容正确渲染
- [ ] 无 Vue 警告
- [ ] 无 Satori 错误

---

## 📚 相关参考

- [Props 系统](props-system.md) - 理解 `accentColors` 数组用法
- [Satori 约束](satori-constraints.md) - 确认样式属性支持
- [常见模式](patterns.md) - 更多强调样式变体
- [故障排除](troubleshooting.md) - 解决 Vue 警告问题

---

**推荐配色：**
- 绿色强调：`#4CAF50`（科技感）
- 橙色强调：`#FF5722`（活力）
- 蓝色强调：`#2196F3`（专业）
- 紫色强调：`#9C27B0`（创意）
