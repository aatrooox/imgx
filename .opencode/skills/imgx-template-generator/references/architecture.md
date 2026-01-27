# IMGX 模板架构说明

## 🎯 核心原则：模板字符串是唯一真相源

**IMGX 项目只使用模板字符串（template strings）来生成图片**。

### 为什么只用模板字符串？

1. **Satori 技术限制**
   - Satori 库只能接受纯字符串作为输入
   - 无法导入 `.vue` 文件或 Vue 组件
   - 必须在运行时将字符串解析为虚拟 DOM

2. **渲染流程**
   ```
   模板字符串 → Satori 解析 → SVG → Resvg 转换 → PNG
   ```

---

## ✅ 正确的架构

### 文件组织

```
server/templates/
├── Base.ts           # export const BaseTemplate = `...`
├── ArticleCover.ts   # export const ArticleCoverTemplate = `...`
├── MacFolder.ts      # export const MacFolderTemplate = `...`
└── CleanTitle.ts     # export const CleanTitleTemplate = `...`

server/utils/image.ts
└── templateStrings 对象注册所有模板

presets/
├── 001.json          # Base 模板的预设
├── 002.json          # ArticleCover 模板的预设
└── 006.json          # CleanTitle 模板的预设
```

### 数据流

```
1. HTTP 请求: GET /006/能力强的人用*AI*更强
              ↓
2. 解析 preset: presets/006.json
              ↓  
3. 查找模板: templateStrings['CleanTitle']
              ↓
4. 合并 props: 默认 + URL 参数
              ↓
5. Satori 渲染: 模板字符串 + props → SVG
              ↓
6. Resvg 转换: SVG → PNG
              ↓
7. 返回图片: Content-Type: image/png
```

---

## ❌ 历史遗留代码（已废弃）

以下文件/目录**在实际渲染中不被使用**，是历史遗留物：

### 1. Vue 组件文件

```
components/template/
├── Base.vue
├── ArticleCover.vue
└── MacFolder.vue
```

**为什么存在？**
- 早期设计尝试直接使用 Vue 组件
- 后来发现 Satori 无法支持
- 但文件没有删除，造成混淆

**为什么不用？**
- Satori 无法导入 `.vue` 文件
- 即使导入也无法解析 `<template>` 区块
- 必须使用纯字符串

### 2. lib/template.ts 注册

```typescript
// lib/template.ts - 未使用
export const serverTemplates = {
  'Base': Base,           // 这个 Base 来自 components/template/Base.vue
  'ArticleCover': ArticleCover
}
```

**为什么不用？**
- 这个注册表引用的是 Vue 组件
- 实际使用的是 `server/utils/image.ts` 中的 `templateStrings`
- 两者完全独立，lib/template.ts 从未被调用

---

## 📂 正确的文件创建流程

### 仅需 3 个文件

```
1. 创建 server/templates/[Name].ts
   ↓
2. 在 server/utils/image.ts 中导入并注册
   ↓
3. 创建 presets/[code].json 配置
```

### 步骤 1: 创建模板文件

```typescript
// server/templates/MyTemplate.ts
export const MyTemplateTemplate = `<div class="w-full h-full flex">
  <!-- 模板内容 -->
</div>`
```

**命名规范：**
- 文件名：PascalCase（MyTemplate.ts）
- 导出常量：`[Name]Template`（MyTemplateTemplate）

### 步骤 2: 注册模板

```typescript
// server/utils/image.ts
import { MyTemplateTemplate } from '../templates/MyTemplate'

const templateStrings: Record<string, string> = {
  'Base': BaseTemplate,
  'MyTemplate': MyTemplateTemplate,  // ← 新增
}
```

**注意事项：**
- 导入名称必须与导出名称一致
- 对象 key 可以是 preset code 或模板名
- 同一模板可以有多个 key（如 '001' 和 'Base'）

### 步骤 3: 创建 Preset

```json
// presets/007.json
{
  "code": "007",
  "template": "MyTemplate",  // ← 对应 templateStrings 的 key
  "size": { "width": 1200, "height": 630 },
  "contentProps": { ... },
  "styleProps": { ... }
}
```

---

## 🔍 如何判断文件是否被使用？

### 被使用的特征

1. **模板字符串** - 在 `server/utils/image.ts` 的 `templateStrings` 对象中注册
2. **Preset 配置** - 在 `presets/*.json` 中被引用
3. **导入路径** - `import { XXX } from '../templates/XXX'`

### 未使用的特征

1. **Vue 组件** - `.vue` 文件在 `components/template/`
2. **lib/template.ts** - 注册 Vue 组件的代码
3. **无导入引用** - 没有被 `server/utils/image.ts` 导入

---

## 🚫 禁止事项

### 不要创建或修改这些文件

1. ❌ **components/template/*.vue** - 已废弃，Satori 无法使用
2. ❌ **lib/template.ts** - 已废弃，注册表未被调用
3. ❌ **任何 Vue 组件形式的模板** - 必须使用字符串

### 为什么要强调？

- **避免混淆**：开发者误以为需要创建 Vue 组件
- **节省时间**：不要在无用的文件上浪费精力
- **保持一致**：统一使用模板字符串架构

---

## 📊 架构对比

### ❌ 错误理解（旧架构）

```
认为需要：
1. 创建 components/template/MyTemplate.vue
2. 在 lib/template.ts 中注册
3. 在 server/utils/image.ts 中也注册
4. 创建 preset

实际：步骤 1-2 完全无用，造成重复劳动
```

### ✅ 正确理解（新架构）

```
实际需要：
1. 创建 server/templates/MyTemplate.ts（模板字符串）
2. 在 server/utils/image.ts 中导入并注册
3. 创建 preset

仅 3 个文件，单一真相源
```

---

## 🎓 关键概念

### 模板字符串 vs Vue 组件

| 特性 | 模板字符串 | Vue 组件 |
|------|-----------|----------|
| 文件扩展名 | `.ts` | `.vue` |
| 格式 | `` `<div>...</div>` `` | `<template><div>...</div></template>` |
| 导出方式 | `export const XXX = \`...\`` | `export default { ... }` |
| Satori 支持 | ✅ 支持 | ❌ 不支持 |
| 使用位置 | `server/templates/` | `components/` (已废弃) |

### templateStrings 对象

```typescript
// server/utils/image.ts
const templateStrings: Record<string, string> = {
  'Base': BaseTemplate,           // key 可以是模板名
  '001': BaseTemplate,            // key 可以是 preset code
  'ArticleCover': ArticleCoverTemplate,
  'MacFolder': MacFolderTemplate,
}
```

**作用：**
- 唯一的模板注册表
- preset 的 `"template"` 字段通过 key 查找
- 返回模板字符串供 Satori 使用

---

## 🔗 相关文档

- [Satori 约束](satori-constraints.md) - 模板字符串必须遵守的规则
- [Props 系统](props-system.md) - 数据如何传递给模板
- [蓝图库](../SKILL.md#选择模板类型) - 不同类型模板的完整示例

---

**总结：只创建 `.ts` 模板文件，不要创建 `.vue` 组件。**
