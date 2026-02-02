---
name: imgx-template-generator
description: 生成符合 Satori 渲染约束的 IMGX Vue 模板，将文本转换为精美的卡片图片
---

# IMGX Template Generator Skill

## 技能描述

生成符合 Satori 渲染约束的 IMGX Vue 模板，将文本转换为精美的卡片图片。

---

## 🚀 快速开始（三步流程）

### 第一步：理解架构（必读 3 分钟）

**在开始之前，必须阅读以下文档：**

| 文档 | 时长 | 内容 |
|------|------|------|
| 📖 [架构说明](references/architecture.md) | 2 分钟 | 了解模板字符串是唯一真相源，避免创建无用的 Vue 组件 |
| ⚠️ [Satori 约束](references/satori-constraints.md) | 3 分钟 | 必须遵守的渲染规则（Flexbox、支持的 CSS） |
| 🔧 [Props 系统](references/props-system.md) | 3 分钟 | 理解数据结构（content、styleProps） |

**为什么必须先读？**
- 避免浪费时间创建不被使用的文件
- 理解 Satori 的严格限制（不是完整浏览器引擎）
- 掌握 Props 数据流，避免 Vue 警告

---

### 第二步：选择蓝图（按需求选择）

根据用户需求，选择对应的模板蓝图：

| 蓝图类型 | 适用场景 | 阅读时长 | 文档链接 |
|---------|---------|---------|---------|
| 📝 **简单文本** | 单行/多行纯文本，统一样式，居中布局 | 5 分钟 | [blueprint-simple-text.md](references/blueprint-simple-text.md) |
| 📋 **多行布局** | 多行文本，每行不同颜色/大小/对齐方式 | 6 分钟 | [blueprint-multi-line.md](references/blueprint-multi-line.md) |
| 🎨 **强调文本** | 需要高亮关键词（背景盒子/特殊颜色） | 7 分钟 | [blueprint-with-accent.md](references/blueprint-with-accent.md) |
| 🌈 **渐变背景** | 使用线性/径向渐变，复杂背景效果 | 6 分钟 | [blueprint-with-gradient.md](references/blueprint-with-gradient.md) |
| 🎯 **带图标** | 需要显示图标/emoji/装饰元素 | 7 分钟 | [blueprint-with-icons.md](references/blueprint-with-icons.md) |
| 🧱 **像素矩阵** | 像素艺术风格，用 emoji/颜色拼成文字或图案 | 5 分钟 | [blueprint-pixel-matrix.md](references/blueprint-pixel-matrix.md) |

**⚠️ 图标使用限制（重要）**

IMGX 系统**仅支持本地图标库**（`assets/icons/` 目录），不支持远程图标库：

| 支持 | 格式 | 说明 |
|------|------|------|
| ✅ **本地图标** | `prefix:icon-name` | 从 `assets/icons/` 加载的图标集 |
| ❌ lucide | ~~`lucide:sparkles`~~ | 远程图标（网络不稳定） |
| ❌ material | ~~`material:home`~~ | 远程图标（未实现） |
| ❌ fa | ~~`fa:github`~~ | 远程图标（未实现） |
| ❌ heroicons | ~~`heroicons:check`~~ | 远程图标（未实现） |

**当前可用图标集：**
- **twemoji**: 68 个表情图标
  - 示例: `twemoji:beaming-face-with-smiling-eyes` 😁, `twemoji:cowboy-hat-face` 🤠
  - 位置: `assets/icons/twemoji-face-icons.json`

**如何添加新图标集：**
1. 将 Iconify JSON 格式的图标集放入 `assets/icons/`
2. 在 `lib/icons.ts` 中导入并注册新图标集
3. 使用格式: `<prefix>:icon-name`（prefix 为图标集的 prefix 字段）

**查看可用图标：** 查看 `assets/icons/` 目录下的 `.json` 文件

---

**✨ 每个蓝图包含：**
- ✅ 适用场景说明
- ✅ 完整模板代码（可直接使用）
- ✅ Preset 配置示例
- ✅ 样式变体（2-4 种）
- ✅ 常见陷阱提示
- ✅ 测试 URL 示例
- ✅ 质量检查清单

---

### 第三步：执行工作流（3 个文件）

#### 3.1 创建模板文件

```typescript
// server/templates/[Name].ts
export const [Name]Template = `<div class="w-full h-full flex">
  <!-- 根据蓝图填充内容 -->
</div>`
```

**要点：**
- 文件名：PascalCase（MyTemplate.ts）
- 导出常量：`[Name]Template`
- 根元素必须：`w-full h-full flex`
- 所有元素必须：`class="flex"`

#### 3.2 注册模板

```typescript
// server/utils/image.ts
import { [Name]Template } from '../templates/[Name]'

const templateStrings: Record<string, string> = {
  // ... 其他模板
  '[Name]': [Name]Template,  // ← 新增这行
}
```

#### 3.3 创建 Preset

```bash
# 1. 检查下一个可用编号
ls presets/*.json | sort

# 2. 创建 preset 文件
# presets/[code].json

**📋 Preset 命名规范**：参考 [preset-naming-convention.md](references/preset-naming-convention.md)

- 文章封面（2.35:1）→ `1xx` (如 `101.json`)
- 小红书（3:4）→ `2xx` (如 `201.json`)
- 视频封面（16:9）→ `3xx` (如 `301.json`)
- 方形（1:1）→ `4xx` (如 `401.json`)
- OG 分享（1.91:1）→ `5xx` (如 `501.json`)

```

```json
{
  "code": "007",
  "name": "My Template",
  "size": { "width": 1200, "height": 630 },
  "ratio": "1.91:1",
  "template": "[Name]",
  "contentProps": { "content": [[...]] },
  "styleProps": {
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
    "padding": "60px"
  }
}
```

**关键字段：**
- `template`: 必须与 `templateStrings` 的 key 一致
- `styleProps`: 必须包含所有 12 个必需字段（见蓝图文档）

#### 3.4 测试验证

```bash
# 启动开发服务器（如未运行）
pnpm dev

# 访问测试 URL
http://localhost:4573/[code]/default
http://localhost:4573/[code]/测试文本*强调*内容
```

**使用质量检查清单：** [checklist.md](references/checklist.md)

---

## 🐛 Production Debugging & Common Pitfalls

### Critical Issue: Satori `atob()` Errors in Production

If you encounter `InvalidCharacterError: Invalid character at atob` in production (but works locally), follow this diagnostic checklist:

#### Issue 1: Buffer Type Mismatch in Nitro Storage

**Symptom:**
```
[Image] Invalid base64 characters detected: 137,80,78,71,13,10...
```

**Root Cause:**
- Nitro's `storage.getItemRaw<Buffer>()` may return `Uint8Array` or plain objects in production
- These don't have `.toString('base64')` method
- Results in raw byte arrays instead of base64 strings

**Fix (server/utils/image-loader.ts):**
```typescript
// ❌ WRONG: Assumes buffer is always Buffer
const base64 = buffer.toString('base64')

// ✅ CORRECT: Defensive type conversion
const properBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer)
const base64 = properBuffer.toString('base64')
const dataUrl = `data:${mimeType};base64,${base64}`

// Add diagnostic logging
console.log('[ImageLoader] Base64 preview:', base64.substring(0, 50))
console.log(`[ImageLoader] type: ${properBuffer.constructor.name}`)
```

#### Issue 2: Satori CSS backgroundImage Bug (Issue #609)

**Symptom:**
```
InvalidCharacterError: Invalid character
    at atob (node:buffer:1292:13)
    at ef (satori/dist/index.js:3:49379)
```

**Root Cause:**
- Known Satori bug with `backgroundImage: url(data:image/...;base64,...)`
- CSS parser's `atob()` fails on certain base64 formats
- Issue: https://github.com/vercel/satori/issues/609

**Fix: Use `<img>` instead of `backgroundImage`**

```typescript
// ❌ AVOID: CSS backgroundImage with data URLs
<div :style="{ backgroundImage: `url(${logoUrl})` }"></div>

// ✅ RECOMMENDED: Direct img element
<img :src="logoUrl" :style="{ objectFit: 'cover' }" />
```

**Why `<img>` works better:**
- Bypasses CSS parser entirely
- Uses Satori's image handler directly
- Better error handling and logging

#### Issue 3: Invalid Tailwind Classes

**Symptom:**
```
`nowrap` unknown or invalid utility
```

**Fix:**
```typescript
// ❌ WRONG: Not a valid Tailwind class
<span class="text-nowrap flex">

// ✅ CORRECT: Valid Tailwind class
<span class="whitespace-nowrap flex">
```

Invalid CSS classes can interfere with Satori's template parsing.

#### Issue 4: btoa() Server-Side Encoding

**Symptom:**
- Works locally but fails in production
- `atob()` errors with SVG icons

**Root Cause:**
- `btoa()` is a browser API, unreliable in Node.js
- Treats input as Latin-1, not UTF-8
- Produces incorrect encoding for non-ASCII characters

**Fix (server/utils/icons.ts, lib/icons.ts):**
```typescript
// ❌ WRONG: Browser API in server code
const base64 = btoa(svgHTML)

// ✅ CORRECT: Node.js Buffer API
const base64 = Buffer.from(svgHTML, 'utf8').toString('base64')
```

#### Issue 5: bgColor=transparent Renders as Black

**Symptom:**
- URL param `?bgColor=transparent` produces black background instead of transparent
- Other CSS color keywords (`inherit`, `currentColor`) also fail

**Root Cause:**
- `paramNormalizer.ts` auto-adds `#` prefix to all color values
- `transparent` becomes `#transparent` (invalid color)
- Satori/browsers render invalid colors as black

**Fix (server/utils/paramNormalizer.ts):**
```typescript
// In normalizeValue() for COLOR_PROPS
if (COLOR_PROPS.has(key)) {
  if (strValue.startsWith('#')) {
    return strValue
  }
  // ✅ NEW: Preserve CSS color keywords
  const cssColorKeywords = ['transparent', 'inherit', 'currentColor', 'none']
  if (cssColorKeywords.includes(strValue.toLowerCase())) {
    return strValue.toLowerCase()
  }
  return `#${strValue}`
}
```

**Usage:**
```bash
# ✅ Now works correctly
GET /api/104/text?bgColor=transparent
GET /api/104/text?bgColor=inherit
```

#### Issue 6: Query String Corruption (+ → space)

**Symptom:**
```
[Image] Base64 contains whitespace - sanitizing
```

**Root Cause:**
- If base64 data URLs are passed via query string
- URL form-encoding converts `+` to space
- `atob()` rejects base64 with whitespace

**Fix (server/utils/image.ts):**
```typescript
// Add sanitization before Satori rendering
if (styleFinalProps.logoUrl?.startsWith('data:')) {
  const idx = styleFinalProps.logoUrl.indexOf(',');
  if (idx !== -1) {
    const head = styleFinalProps.logoUrl.slice(0, idx + 1);
    let body = styleFinalProps.logoUrl.slice(idx + 1);
    
    // Remove whitespace corruption
    if (/\s/.test(body)) {
      console.warn('[Image] Base64 contains whitespace - sanitizing');
      body = body.replace(/\s+/g, '');
    }
    
    // Validate charset
    if (!/^[A-Za-z0-9+/=]+$/.test(body)) {
      throw createError({ 
        statusCode: 500, 
        statusMessage: 'Invalid image data encoding' 
      });
    }
    
    styleFinalProps.logoUrl = head + body;
  }
}
```

**Prevention:**
- Avoid passing data URLs in query strings
- Use asset paths instead: `logoPath=images/logo.png`
- Or use POST with JSON body (preserves `+` characters)

### Diagnostic Techniques

**1. Add Logging at Key Points:**

```typescript
// In image-loader.ts
console.log('[ImageLoader] Base64 preview:', base64.substring(0, 50))
console.log('[ImageLoader] Buffer type:', buffer.constructor.name)

// In image.ts
console.log('[Image] logoUrl preview:', styleFinalProps.logoUrl?.substring(0, 60))

// In satori.ts
console.log('[Satori] Rendering HTML length:', html.length)
```

**2. Check Production Logs:**

✅ **Success Pattern:**
```
[ImageLoader] Base64 preview: iVBORw0KGgoAAAANSUhEU...
[ImageLoader] type: Buffer
```

❌ **Failure Pattern:**
```
[Image] Invalid base64 characters: 137,80,78,71...
```
→ Indicates Buffer serialization issue

**3. Verify Base64 Integrity:**

```bash
# Extract base64 from logs and test decode
echo "iVBORw0KGgoAAAA..." | base64 -d | file -
# Should show: PNG image data
```

### Best Practices Summary

| Component | Best Practice | Avoid |
|-----------|---------------|-------|
| **Images** | Use `<img src="data:...">` | `backgroundImage: url(...)` |
| **Buffer** | `Buffer.isBuffer()` check | Assume storage returns Buffer |
| **Base64** | `Buffer.from().toString('base64')` | `btoa()` on server |
| **CSS** | Valid Tailwind classes | `text-nowrap` (invalid) |
| **Data URLs** | Pass as asset paths | Query string parameters |
| **Logging** | Preview first 50 chars | Log full 10KB base64 |

### When to Escalate

If after applying all fixes you still see `atob()` errors:

1. **Check Satori version:** Update to latest (`npm ls satori`)
2. **Inspect actual HTML:** Log rendered HTML before Satori
3. **Test SVG rendering:** Try pure SVG output (`format=svg`)
4. **File upstream bug:** Search https://github.com/vercel/satori/issues
5. **Workaround:** Switch from Satori to Puppeteer/Playwright for complex cases

---

## 📚 完整文档索引

### 核心概念（必读）
- [架构说明](references/architecture.md) - 模板系统设计原理
- [Satori 约束](references/satori-constraints.md) - 渲染引擎限制
- [Props 系统](references/props-system.md) - 数据结构详解

### 模板蓝图（按需选择）
- [简单文本模板](references/blueprint-simple-text.md)
- [多行布局模板](references/blueprint-multi-line.md)
- [强调文本模板](references/blueprint-with-accent.md)
- [渐变背景模板](references/blueprint-with-gradient.md)
- [图标模板](references/blueprint-with-icons.md)
- [像素矩阵模板](references/blueprint-pixel-matrix.md)

### 辅助资料（问题查询）
- [常见模式库](references/patterns.md) - 15+ 设计模式和代码片段
- [故障排除指南](references/troubleshooting.md) - 10 个常见问题及解决方案
- [质量检查清单](references/checklist.md) - 22 个检查项

### 示例演示（学习参考）
- [CleanTitle 完整演示](examples/CleanTitle-walkthrough.md) - 端到端工作流
- [模板对比分析](examples/template-comparison.md) - 现有模板特点

---

## ⚠️ 关键规则（禁止事项）

### ❌ 不要创建这些文件

1. **components/template/*.vue** - 已废弃，Satori 无法使用 Vue 组件
2. **lib/template.ts** - 已废弃，注册表未被调用
3. **任何 .vue 文件作为模板** - 必须使用 .ts 模板字符串

### ❌ 不要使用这些 CSS

1. **box-shadow** - Satori 不支持阴影效果
2. **transform** - Satori 不支持变换（旋转/缩放）
3. **filter** - Satori 不支持滤镜
4. **animations** - 静态图片无法展示动画
5. **z-index** - 通过 DOM 顺序控制层级

### ✅ 必须遵守

1. **所有元素必须 flex** - 添加 `class="flex"`
2. **包含所有必需 styleProps** - 12 个字段缺一不可
3. **测试后再提交** - 使用质量检查清单验证
4. **遵循蓝图结构** - 不要随意修改模板结构

---

## 🎯 工作流程图

```
用户需求
   ↓
📖 阅读架构文档（architecture.md, satori-constraints.md, props-system.md）
   ↓
🎨 选择蓝图（simple-text / multi-line / accent / gradient / icons）
   ↓
📝 阅读蓝图文档（了解完整代码和配置）
   ↓
💻 创建 server/templates/[Name].ts
   ↓
⚙️ 注册到 server/utils/image.ts
   ↓
📦 创建 presets/[code].json
   ↓
🧪 测试 http://localhost:4573/[code]/default
   ↓
✅ 质量检查（checklist.md）
   ↓
🎉 完成！
```

---

## 💡 快速决策树

### 需求分析 → 蓝图选择

```
问题 1: 是否需要强调特定文字（高亮/背景盒子）？
  ├─ 是 → 🎨 使用 blueprint-with-accent.md
  └─ 否 → 继续

问题 2: 是否需要渐变背景或复杂背景效果？
  ├─ 是 → 🌈 使用 blueprint-with-gradient.md
  └─ 否 → 继续

问题 3: 是否需要显示图标或 emoji？
  ├─ 是 → 🎯 使用 blueprint-with-icons.md
  └─ 否 → 继续

问题 4: 是否需要像素艺术风格（用色块/emoji拼成图案）？
  ├─ 是 → 🧱 使用 blueprint-pixel-matrix.md
  └─ 否 → 继续

问题 5: 是否需要多行文本且每行样式不同？
  ├─ 是 → 📋 使用 blueprint-multi-line.md
  └─ 否 → 📝 使用 blueprint-simple-text.md
```

---

## 🔗 外部资源

- [Satori 官方文档](https://github.com/vercel/satori)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Vue 3 模板语法](https://vuejs.org/guide/essentials/template-syntax.html)

---

## 📊 文档统计

- **总文档数**: 15 个
- **核心文档**: 3 个（架构、Satori、Props）
- **蓝图库**: 6 个（覆盖所有常见场景）
- **辅助资料**: 3 个（模式、故障、清单）
- **示例演示**: 2 个（学习参考）

---

## 🎓 学习路径建议

### 新手（首次使用）

1. **必读**：架构说明（2 分钟）
2. **必读**：Satori 约束（3 分钟）
3. **选择**：简单文本蓝图（5 分钟）
4. **实践**：跟随蓝图创建第一个模板
5. **验证**：使用质量检查清单

**预计时间**：30 分钟完成第一个模板

### 进阶（第二个模板开始）

1. **回顾**：Props 系统（理解数据流）
2. **选择**：根据需求选择蓝图
3. **参考**：常见模式库（复用代码片段）
4. **调试**：故障排除指南（遇到问题时查阅）

**预计时间**：15 分钟完成新模板

---

## ✅ 成功标准

一个合格的模板必须满足：

1. ✅ 访问 `/{code}/default` 正常显示
2. ✅ 样式符合设计要求
3. ✅ 浏览器控制台无 Vue 警告
4. ✅ 无 Satori 渲染错误
5. ✅ 代码通过质量检查清单
6. ✅ 测试不同内容均正常渲染

---

**开始前必读：** [架构说明](references/architecture.md) → [Satori 约束](references/satori-constraints.md) → [选择蓝图](#第二步选择蓝图按需求选择)

**遇到问题？** 查阅 [故障排除指南](references/troubleshooting.md) 或 [Production Debugging](#-production-debugging--common-pitfalls)
