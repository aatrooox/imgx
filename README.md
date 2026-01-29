<div align="center">

# 🎨 IMGX

**一个 URL，一张精美图片 —— AI 时代的低成本图片生成解决方案**

[![Version](https://img.shields.io/badge/version-0.8.3-blue.svg)](https://github.com/aatrooox/imgx)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![Nuxt](https://img.shields.io/badge/Nuxt-4.3.0-00DC82.svg)](https://nuxt.com)

[在线体验](https://imgx.zzao.club) · [快速开始](#-快速开始) · [模板示例](#-模板展示) · [API 文档](#-api-使用)

</div>

---

## 💡 核心理念

**在 Stable Diffusion、Midjourney、DALL-E 横行的时代，为什么还需要 IMGX？**

因为并非所有场景都需要最新的生图大模型：

- 🎯 **精准可控** - 你想要的是"带标题的封面"，而非"风格不确定的艺术品"
- ⚡️ **即时响应** - URL 直出，无需等待 GPU 排队
- 💰 **零成本** - 无需订阅 Midjourney Pro，无需购买 GPU 算力
- 🔄 **稳定可复现** - 相同输入必定产出相同结果，适合自动化流程

**IMGX 的突破：** 曾因模板生产力不足而搁浅，现借助 AI Skill 能力重启——**让 AI 生产模板，而非生成图片**。你获得的不是一次性的图片，而是可复用的模板资产。

## ✨ 为什么选择 IMGX？

### 传统方案的痛点

| 方案 | 问题 |
|------|------|
| 🎨 **设计工具** (Figma/PS) | 每次都要手动调整，无法自动化 |
| 🤖 **AI 生图** (Midjourney/SD) | 成本高、不可控、结果随机 |
| 💰 **在线工具** (创客贴等) | 限制下载、添加水印、需要会员 |
| 📐 **截图/Canvas** | 代码实现复杂，维护成本高 |

### IMGX 的解决方案

- ✅ **一个 URL 搞定** - 改文字只需改 URL 参数
- ✅ **完全免费** - 无水印、无限制、可商用
- ✅ **结果可控** - 相同输入 = 相同输出
- ✅ **AI 赋能** - 用 AI 生成模板代码，而非每次生图
- ✅ **自托管友好** - 部署到自己的服务器，数据完全掌控

## 🚀 快速开始

### 最简单的方式

```bash
# 使用默认样式
https://imgx.zzao.club/api/101/default
```

![示例图片](https://imgx.zzao.club/api/101/default)

### 自定义内容

```bash
# 动态文字内容（使用 *{}* 标记高亮部分）
https://imgx.zzao.club/api/006/欢迎使用*IMGX*
```

### 完整控制

```bash
# GET 请求：路径传内容，query 传样式
GET https://imgx.zzao.club/api/102/😊/🎉/IMGX~让图片生成~更简单

# POST 请求：完整 JSON 控制
POST https://imgx.zzao.club/
Content-Type: application/json
{
  "preset": "102",
  "content": {
    "topLeftIcon": "twemoji:fire",
    "bottomRightIcon": "twemoji:rocket",
    "text": "欢迎~使用~IMGX"
  }
}
```

## 🎯 核心特性

### 🤖 AI 驱动的模板生产

**这才是 IMGX 的杀手锏！**

- **传统方式：** 手写模板 → 调试约束 → 反复修改（耗时数小时）
- **IMGX 方式：** 描述需求 → AI Skill 生成 → 微调保存（耗时数分钟）

示例对话：
```
你：「生成一个微信公众号封面，渐变背景，支持图标装饰」
AI：✅ 生成符合 Satori 约束的 Vue 模板
    ✅ 提供默认配置 JSON
    ✅ 创建预设码：102
你：🎉 立即可用！https://imgx.zzao.club/api/102/你的标题
```

### 🎨 可视化模板编辑器
- Vue 3 组件式模板，所见即所得
- 实时预览，即时调整
- AI 生成 + 人工微调的混合工作流

### 📦 预设系统
- 创建可复用的配置预设
- 3-4 位预设码，简单易记
- 一次创建，无限复用（这就是成本优势所在）

### 🎭 Emoji & 图标支持
- 内置 Twemoji 图标库（10,000+ 图标）
- 支持 SVG 图标
- 动态图标参数传递

### ⚡️ 高性能
- 基于 Satori 的 SVG 渲染（不依赖浏览器，纯计算）
- 服务端缓存机制
- ETag 支持浏览器缓存
- 响应速度 < 100ms

### 🔧 灵活的 API
- RESTful GET/POST 接口
- 参数化内容控制
- 样式实时覆盖
- 支持批量生成

## 🖼️ 模板展示

### 预设 102 - 微信公众号封面（动态图标）

<table>
<tr>
<td width="50%">

**默认效果**

![预设 102 默认](https://imgx.zzao.club/api/102/default)

</td>
<td width="50%">

**自定义效果**

![预设 102 自定义](https://imgx.zzao.club/api/102/twemoji:drooling-face/twemoji:face-with-symbols-on-mouth/IMGX~让图片生成~更简单)

</td>
</tr>
</table>

```bash
# 默认样式
https://imgx.zzao.club/api/102/default

# 自定义图标和文字
https://imgx.zzao.club/api/102/{左上图标}/{右下图标}/{文字内容}
```

### 预设 101 - 微信公众号封面（固定装饰）

<table>
<tr>
<td width="50%">

**默认效果**

![预设 101 默认](https://imgx.zzao.club/api/101/default)

</td>
<td width="50%">

**自定义效果**

![预设 101 自定义](https://imgx.zzao.club/api/101/2025年度*技术总结*)

</td>
</tr>
</table>

```bash
# 默认样式
https://imgx.zzao.club/api/101/default

# 自定义文字（使用 ~ 标记高亮部分）
https://imgx.zzao.club/api/101/2025年度~技术总结
```

## 📖 API 使用

### GET 请求模式

**格式：** `https://imgx.zzao.club/{预设码}/{动态内容}?{样式参数}`

**参数说明：**
- `预设码`：3-4 位数字，对应特定模板和默认样式
- `动态内容`：路径参数，按预设的 `contentKeys` 顺序传递
- `样式参数`：query 参数，覆盖预设的默认样式

**示例：**

```bash
# 基础使用
GET /102/default

# 单个内容参数
GET /006/欢迎使用~IMGX

# 多个内容参数
GET /102/😊/🎉/文字内容

# 带样式覆盖
GET /006/标题文字?fontSizes[]=100px&colors[]=FF0000
```

### POST 请求模式

**端点：** `POST https://imgx.zzao.club/`

**请求体：**

```json
{
  "preset": "102",
  "content": {
    "topLeftIcon": "twemoji:beaming-face-with-smiling-eyes",
    "bottomRightIcon": "twemoji:rocket", 
    "text": "IMGX~快速生成~封面图"
  },
  "style": {
    "fontSizes": ["120px"],
    "colors": ["#FFFFFF"]
  }
}
```

### 文字高亮语法

使用 `~` 符号标记需要高亮显示的文字：

```bash
# 原始文字
IMGX 快速生成 封面图

# 高亮"快速生成"部分
IMGX~快速生成~封面图

# 最终显示：IMGX 快速生成（金色） 封面图
```

## 🛠️ 技术栈

### 核心技术

- **框架：** [Nuxt 4](https://nuxt.com) - 现代化全栈框架
- **渲染：** [Satori](https://github.com/vercel/satori) - HTML/CSS 转 SVG（不依赖浏览器）
- **转换：** [Resvg](https://github.com/yisibl/resvg-js) - SVG 转 PNG（纯 Rust，高性能）
- **UI：** Vue 3 + Tailwind CSS + shadcn-vue
- **字体：** 优设标体黑、抖音美好体（免费商用）
- **图标：** Twemoji、Iconify（10,000+ 图标）

### 🤖 AI 加持

- **模板生成：** 借助 `imgx-template-generator` Skill
  - 输入：参考图片或文字描述
  - 输出：符合 Satori 约束的 Vue 模板代码
  - 优势：一次生成，无限复用；成本远低于 DALL-E/Midjourney

**技术对比：**

| 方案 | 成本 | 速度 | 可控性 | 适用场景 |
|------|------|------|--------|---------|
| **IMGX (模板)** | 一次性 | 毫秒级 | ⭐⭐⭐⭐⭐ | 标题卡片、封面图、徽章 |
| **Midjourney** | 订阅制 | 秒级 | ⭐⭐ | 艺术创作、概念图 |
| **DALL-E 3** | 按次付费 | 秒级 | ⭐⭐⭐ | 通用图片生成 |
| **Stable Diffusion** | GPU 成本 | 秒级 | ⭐⭐⭐⭐ | 可控图片生成 |

## 🎨 可用模板

| 模板代码 | 模板名称 | 尺寸 | 适用场景 |
|---------|---------|------|---------|
| `WeChatCover` | 微信公众号封面 | 1200×510 | 公众号文章 |
| `CleanTitle(测试用)` | 简洁标题卡片 | 1200×510 | 文章封面、社交分享 |
| `MacFolder(测试用)` | Mac 文件夹风格 | 自定义 | 创意设计 |
| `ArticleCover(测试用)` | 文章封面通用 | 自定义 | 博客文章 |
| `Base(测试用)` | 基础模板 | 自定义 | 快速原型 |

## 🧠 工作原理：AI 生产模板 vs AI 生成图片

### 传统 AI 生图流程（按需生成）

```mermaid
用户需求 → Prompt 工程 → 调用 API → 等待渲染 → 获得图片
   ↓
每次都要花钱、花时间、结果不确定
```

### IMGX 流程（模板复用）

```mermaid
设计需求 → AI Skill 生成模板 → 保存为预设 → URL 参数化调用
   ↓                             ↓
一次性成本                     无限次免费使用
```

**关键差异：**

1. **成本结构不同**
   - 传统 AI 生图：每次 $0.02-0.1（累积成本）
   - IMGX：模板创建一次性成本 + 无限次零成本使用

2. **适用场景不同**
   - 传统 AI 生图：需要创意、艺术性、多样性的场景
   - IMGX：需要稳定、可控、批量生成的场景

3. **生产力提升方式不同**
   - 传统 AI 生图：降低单张图片制作难度
   - IMGX：降低模板制作难度，然后批量复用

### 💎 AI Skill 的价值

**问题：** 写符合 Satori 约束的 Vue 模板很繁琐（必须用 Flexbox、不能用某些 CSS 属性）

**解决：** `imgx-template-generator` Skill 可以：
- 📷 根据参考图片反向生成模板代码
- 📝 根据文字描述创建符合规范的模板
- ✅ 自动处理 Satori 的各种限制和约束
- 🎨 生成美观且可用的样式方案

**示例：**

```bash
# 输入给 AI Skill
"生成一个微信公众号封面模板，渐变紫色背景，白色标题，支持左上和右下角图标装饰"

# AI Skill 输出
✅ 完整的 Vue 模板代码（符合 Satori 约束）
✅ 默认样式配置 JSON
✅ 参数说明文档

# 你获得
🎯 可立即使用的预设
🎯 可通过 URL 无限次调用
🎯 总成本 ≈ 一次 GPT-4 对话
```

## 🤝 使用场景

- 📱 **公众号文章封面** - 快速生成符合规格的封面图
- 📝 **博客文章配图** - Markdown 友好的图片 URL
- 🎨 **社交媒体分享** - 动态生成分享卡片
- 🏷️ **徽章和标签** - GitHub Profile 装饰元素
- 📊 **数据可视化标注** - 为图表添加标题卡片

## 💡 高级玩法

### 1. Markdown 中的动态图片

```markdown
![封面](https://imgx.zzao.club/api/006/你的文章标题~关键词~更多内容)
```

### 2. GitHub Profile 装饰

```markdown
![](https://imgx.zzao.club/api/102/twemoji:fire/twemoji:rocket/Hello~World)
```

### 3. 批量生成（结合脚本）

```javascript
const titles = ['标题1', '标题2', '标题3']
const images = titles.map(t => 
  `https://imgx.zzao.club/api/006/${encodeURIComponent(t)}`
)
```

## 🏗️ 本地开发

```bash
# 克隆项目
git clone https://github.com/aatrooox/imgx.git
cd imgx

# 安装依赖（需要 pnpm）
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 📦 部署指南

### 1. Node.js 环境

```bash
# 构建
pnpm build

# 启动
node .output/server/index.mjs
```

### 2. Docker（开发中）

```bash
docker build -t imgx .
docker run -p 3000:3000 imgx
```

## 🙏 致谢

- [Satori](https://github.com/vercel/satori) - 强大的 HTML/CSS 转 SVG 引擎
- [v-satori](https://github.com/wobsoriano/v-satori) - Vue 3 + Satori 集成
- [Nuxt](https://nuxt.com) - 现代化全栈框架
- [Resvg](https://github.com/yisibl/resvg-js) - 高质量 SVG 转图片

## 📬 联系我们

有新模板建议、功能需求或想围观开发进度？

**邮箱：** gnakzz@qq.com

**微信：** 请备注 IMGX

<div align="center">
  <img src="https://img.zzao.club/article/202412301618241.jpg" width="200" alt="微信二维码" />
</div>

---

<div align="center">

## 📄 License

[MIT License](./LICENSE)

**Made with ❤️ by [aatrooox](https://zzao.club)**

如果这个项目对你有帮助，欢迎 ⭐️ Star 支持一下！

</div>