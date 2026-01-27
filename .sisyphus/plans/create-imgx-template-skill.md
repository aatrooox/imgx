# Create IMGX Template Generator Skill

## Context

### Original Request
用户希望重启 IMGX 项目，利用 AI 降低模板创建成本。之前的痛点是需要大量人工参与创建模板，现在希望通过项目级 skill 来指导 AI 生成符合 Satori 规范的 Vue 模板。

### User Requirements
- **使用者**: 未来可能开源分享，需要完整教程式文档
- **场景**: 核心场景（封面图、社交卡片），保持简洁
- **参考**: 集成 Base.vue 作为标准示例

### Key Points
1. Skill 需要详细说明 Satori 的严格约束（flex 布局、禁用 CSS 等）
2. 提供 Props 分类指南（Content vs Style）
3. 支持特殊语法（`*accent*`, `[emoji]`, `+` 分隔符）
4. 包含完整工作流程（从需求到部署）
5. 提供质量检查清单

---

## Work Objectives

### Core Objective
创建一个教程级别的 OpenCode skill，帮助开发者（包括未来的开源贡献者）生成符合 IMGX/Satori 规范的 Vue 模板，包含详细的约束说明、设计模式和完整工作流程。

### Concrete Deliverables
- `.opencode/skills/imgx-template-generator/SKILL.md` 文件
- Skill 加载验证文档

### Definition of Done
- [ ] Skill 文件符合 OpenCode 规范（frontmatter + markdown）
- [ ] 包含完整的 Satori 约束说明（MUST/NEVER 规则）
- [ ] 集成 Base.vue 作为标准参考示例
- [ ] 提供 3-5 个核心场景的设计模式
- [ ] 包含 Props 分类指南和特殊语法说明
- [ ] 提供质量检查清单和常见错误避免
- [ ] 提供完整工作流程（从生成到部署）
- [ ] Skill 能够被 OpenCode 正确加载和使用

### Must Have
- Frontmatter 符合 OpenCode 规范
- Satori 渲染约束完整且准确
- Base.vue 代码示例集成
- Content/Style Props 分类规则
- 核心场景设计模式（封面图、社交卡片）
- 特殊语法说明（`*accent*`, `[emoji]`, `+`）
- 质量检查清单
- 完整工作流程

### Must NOT Have (Guardrails)
- 不要包含过多非核心场景（保持文档简洁）
- 不要使用非 Satori 兼容的 CSS 示例
- 不要假设用户熟悉 IMGX 项目（需要详细说明）
- 不要提供未经验证的代码示例

---

## Verification Strategy

### Manual QA

#### 文件创建验证
- [ ] 目录存在: `.opencode/skills/imgx-template-generator/`
- [ ] 文件存在: `SKILL.md`
- [ ] 文件名大写: `SKILL.md` (不是 `skill.md`)

#### Frontmatter 验证
- [ ] 包含 `name: imgx-template-generator`
- [ ] 包含 `description` (1-1024 字符)
- [ ] `name` 匹配目录名
- [ ] `name` 符合正则: `^[a-z0-9]+(-[a-z0-9]+)*$`

#### 内容完整性验证
- [ ] 包含 "What I do" 部分
- [ ] 包含 "When to use me" 部分
- [ ] 包含 "Critical constraints" 部分
- [ ] 包含至少 3 个设计模式示例
- [ ] 包含 Props 分类指南
- [ ] 包含特殊语法说明
- [ ] 包含质量检查清单
- [ ] 包含完整工作流程

#### Skill 加载验证
- [ ] 重启 OpenCode 或重新加载配置
- [ ] 执行命令确认 skill 可见: 查看 `skill` tool 的 available_skills 列表
- [ ] 尝试加载 skill: `skill({ name: "imgx-template-generator" })`
- [ ] 验证内容完整显示

---

## Task Flow

```
Task 1 (创建目录) → Task 2 (编写 frontmatter + 核心说明)
                       ↓
                     Task 3 (添加约束规则)
                       ↓
                     Task 4 (集成 Base.vue)
                       ↓
                     Task 5 (添加设计模式)
                       ↓
                     Task 6 (工作流程和示例)
                       ↓
                     Task 7 (验证加载)
```

## Parallelization

| Group | Tasks | Reason |
|-------|-------|--------|
| 无并行 | 所有任务顺序执行 | 每个任务依赖前一个任务的输出 |

---

## TODOs

- [ ] 1. 创建 skill 目录结构

  **What to do**:
  - 创建目录 `.opencode/skills/imgx-template-generator/`
  - 确保目录名为小写字母和连字符

  **Must NOT do**:
  - 不要使用大写字母或下划线
  - 不要在其他位置创建 skill 文件

  **Parallelizable**: NO (基础任务)

  **References**:
  - OpenCode Skill 文档: https://opencode.ai/docs/skills/#place-files
  - 目录命名规范: `^[a-z0-9]+(-[a-z0-9]+)*$`

  **Acceptance Criteria**:

  **Manual Execution Verification**:
  - [ ] 命令: `ls .opencode/skills/imgx-template-generator`
  - [ ] 预期: 目录存在（即使为空也显示目录路径）
  - [ ] 命令: `echo %ERRORLEVEL%` (Windows) 或 `echo $?` (Unix)
  - [ ] 预期: 返回 0 (成功)

  **Commit**: NO (与 Task 2 一起提交)

---

- [ ] 2. 编写 SKILL.md frontmatter 和核心说明

  **What to do**:
  - 创建文件 `.opencode/skills/imgx-template-generator/SKILL.md`
  - 编写 YAML frontmatter:
    ```yaml
    ---
    name: imgx-template-generator
    description: Generate IMGX-compatible Vue templates that convert text to beautiful card images with Satori
    license: MIT
    compatibility: opencode
    metadata:
      audience: template-creators
      workflow: imgx-development
    ---
    ```
  - 添加核心说明部分:
    - "What I do" (5-7 条功能说明)
    - "When to use me" (4-5 个使用场景)

  **Must NOT do**:
  - 不要使用大写文件名（必须是 `SKILL.md` 不是 `skill.md`）
  - 不要在 frontmatter 中添加未定义的字段
  - 不要让 description 超过 1024 字符

  **Parallelizable**: NO (依赖 Task 1)

  **References**:
  - OpenCode Skill frontmatter 规范: https://opencode.ai/docs/skills/#write-frontmatter
  - 示例: `.claude/skills/*/SKILL.md` (如果存在)

  **Acceptance Criteria**:

  **Manual Execution Verification**:
  - [ ] 命令: `type .opencode\skills\imgx-template-generator\SKILL.md | findstr "name:"` (Windows)
  - [ ] 预期: 输出包含 `name: imgx-template-generator`
  - [ ] 命令: `type .opencode\skills\imgx-template-generator\SKILL.md | findstr "description:"` (Windows)
  - [ ] 预期: 输出包含 description 字段
  - [ ] 文件前 10 行包含完整的 YAML frontmatter（以 `---` 开始和结束）

  **Commit**: YES
  - Message: `feat(skill): add imgx-template-generator skill with frontmatter`
  - Files: `.opencode/skills/imgx-template-generator/SKILL.md`
  - Pre-commit: 无（首次创建）

---

- [ ] 3. 添加 Satori 约束规则和质量检查清单

  **What to do**:
  - 在 SKILL.md 中添加 "Critical constraints" 部分
  - 编写 Satori 渲染规则:
    - ✅ MUST 规则（必须遵守的约束）
    - ❌ NEVER 规则（禁止使用的特性）
  - 添加模板结构示例（完整的 `<script setup>` + `<template>` 代码）
  - 添加 Props JSON 结构示例
  - 添加 Props 类型分类规则（Content vs Style）
  - 添加特殊语法支持说明（`*accent*`, `[emoji]`, `+`）
  - 添加可用字体列表
  - 添加 "Quality checklist" 部分（10+ 条检查项）
  - 添加 "Common pitfalls to avoid" 部分（7+ 条常见错误）

  **Must NOT do**:
  - 不要包含非 Satori 兼容的 CSS 示例（如 box-shadow, transform）
  - 不要提供未经验证的代码示例
  - 不要使用项目中不存在的字体

  **Parallelizable**: NO (依赖 Task 2)

  **References**:

  **Satori 官方约束**:
  - Satori GitHub: https://github.com/vercel/satori
  - Flex 布局要求: 每个 div 必须显式 display: flex
  - CSS 限制: 不支持 box-shadow, transform, filter 等

  **项目代码参考**:
  - `components/template/Base.vue:1-46` - 标准模板结构
  - `lib/content.ts:74-116` - 特殊语法解析逻辑（`*accent*`, `[emoji]`）
  - `lib/params.ts:28-33` - Align 映射表
  - `server/api/img/[size]/[template]/[text].get.ts:71-84` - 可用字体列表

  **特殊语法说明**:
  - `*text*` → `part.type === 'accent'` (强调文字)
  - `[iconify:name]` → `part.type === 'emoji'`, `part.base64URL` (图标)
  - `+` → 行分隔符，拆分为 `content[0]`, `content[1]`

  **Acceptance Criteria**:

  **Manual Execution Verification**:
  - [ ] 命令: `type .opencode\skills\imgx-template-generator\SKILL.md | findstr "MUST"`
  - [ ] 预期: 输出包含至少 5 条 MUST 规则
  - [ ] 命令: `type .opencode\skills\imgx-template-generator\SKILL.md | findstr "NEVER"`
  - [ ] 预期: 输出包含至少 5 条 NEVER 规则
  - [ ] 命令: `type .opencode\skills\imgx-template-generator\SKILL.md | findstr "Quality checklist"`
  - [ ] 预期: 输出包含质量检查清单标题
  - [ ] 手动检查: 文档中包含完整的 `<script setup>` + `<template>` 代码示例
  - [ ] 手动检查: Props JSON 示例包含 content 和 style 分类说明

  **Commit**: YES
  - Message: `feat(skill): add Satori constraints and quality checklist`
  - Files: `.opencode/skills/imgx-template-generator/SKILL.md`
  - Pre-commit: 无

---

- [ ] 4. 集成 Base.vue 作为标准参考模板

  **What to do**:
  - 在 SKILL.md 中添加 "Standard reference template" 部分
  - 完整引用 `components/template/Base.vue` 的代码
  - 添加代码注释说明每个部分的作用:
    - Props 解构和默认值
    - 根元素布局（w-full h-full flex）
    - Content wrapper（可选的背景层）
    - Line-by-line 渲染逻辑
    - Text parts 处理（normal, accent, emoji）
  - 说明为什么这是标准模板（符合所有约束）
  - 提供使用此模板的最佳实践

  **Must NOT do**:
  - 不要修改 Base.vue 的原始代码
  - 不要添加未经验证的改进建议
  - 不要引用项目中不存在的其他模板

  **Parallelizable**: NO (依赖 Task 3)

  **References**:

  **项目代码**:
  - `components/template/Base.vue:1-46` - 完整的标准模板代码
  - `lib/content.ts:16-34` - `componentBaseProps` 类型定义

  **为什么 Base.vue 是标准**:
  - ✅ 完全符合 Satori flex 布局要求
  - ✅ 支持所有特殊语法（accent, emoji）
  - ✅ Props 分类清晰（content, style）
  - ✅ 支持多行渲染和自定义对齐
  - ✅ 支持可选的 content wrapper 层
  - ✅ 默认值合理且完整

  **Acceptance Criteria**:

  **Manual Execution Verification**:
  - [ ] 命令: `type .opencode\skills\imgx-template-generator\SKILL.md | findstr "Base.vue"`
  - [ ] 预期: 输出包含 Base.vue 引用
  - [ ] 命令: `type .opencode\skills\imgx-template-generator\SKILL.md | findstr "componentBaseProps"`
  - [ ] 预期: 输出包含类型定义引用
  - [ ] 手动检查: 文档中包含完整的 Base.vue 代码块（至少 40 行）
  - [ ] 手动检查: 代码块包含详细的行内注释

  **Commit**: YES
  - Message: `feat(skill): integrate Base.vue as standard reference template`
  - Files: `.opencode/skills/imgx-template-generator/SKILL.md`
  - Pre-commit: 无

---

- [ ] 5. 添加核心场景设计模式

  **What to do**:
  - 在 SKILL.md 中添加 "Design patterns" 部分
  - 提供 3-5 个核心场景的完整代码模式:
    1. **Simple title card** (居中标题 + 渐变背景)
    2. **Icon + Title** (图标在左，标题在右)
    3. **Blog post cover** (标题 + 副标题 + 作者，垂直排列)
    4. **Social share card** (带图标的社交分享卡片)
    5. **Status badge** (简洁的状态徽章)
  - 每个模式包含:
    - 完整的 `<template>` 代码
    - 对应的 Props JSON
    - Props 分类说明（content/style）
    - GET API 使用示例
    - 适用场景说明
  - 添加 "Output format" 部分，说明生成模板时的输出结构

  **Must NOT do**:
  - 不要添加过于复杂的非核心场景
  - 不要提供未经测试的代码
  - 不要包含 Satori 不支持的 CSS

  **Parallelizable**: NO (依赖 Task 4)

  **References**:

  **已有模板参考**:
  - `components/template/Base.vue` - 多行文本模板
  - `pages/playground.vue:141-149` - Icon + Title 示例

  **核心场景定义**:
  - 封面图: 文章、博客、课程封面
  - 社交卡片: Twitter, Facebook, LinkedIn 分享图
  - 徽章: GitHub Profile, 笔记应用装饰

  **设计原则**:
  - 简洁优先（不超过 3 层嵌套）
  - 响应式（适配不同尺寸）
  - 对比度高（确保文字可读性）
  - 渐变背景（增加视觉吸引力）

  **Acceptance Criteria**:

  **Manual Execution Verification**:
  - [ ] 命令: `type .opencode\skills\imgx-template-generator\SKILL.md | findstr "Design patterns"`
  - [ ] 预期: 输出包含 "Design patterns" 标题
  - [ ] 命令: `type .opencode\skills\imgx-template-generator\SKILL.md | findstr "Simple title card"`
  - [ ] 预期: 输出包含至少一个模式标题
  - [ ] 手动检查: 每个模式包含完整的代码 + Props + 使用示例
  - [ ] 手动检查: 至少包含 3 个核心场景模式
  - [ ] 手动检查: 每个模式的代码都符合 Satori 约束

  **Commit**: YES
  - Message: `feat(skill): add core design patterns for cover and social cards`
  - Files: `.opencode/skills/imgx-template-generator/SKILL.md`
  - Pre-commit: 无

---

- [ ] 6. 编写完整工作流程和使用示例

  **What to do**:
  - 在 SKILL.md 中添加 "Workflow" 部分，包含 4 个阶段:
    1. Gather requirements (收集需求的问题清单)
    2. Design layout (布局设计建议)
    3. Generate code (代码生成步骤)
    4. Provide usage (使用示例和部署指导)
  - 添加 "Examples" 部分，提供至少 1 个完整端到端示例:
    - 场景描述（如 "Blog post cover"）
    - 完整的 `<template>` 代码
    - Props JSON
    - Props 分类
    - GET API 使用示例
  - 添加 "Next steps after generation" 部分:
    - 如何在 Playground 中测试
    - 如何创建模板
    - 如何创建预设
    - 如何在生产环境使用
  - 添加 "Questions to ask" 部分（AI 需要询问用户的问题）
  - 添加 "Tips for great templates" 部分（7+ 条最佳实践）
  - 添加总结和鼓励性文字

  **Must NOT do**:
  - 不要跳过工作流程中的关键步骤
  - 不要假设用户知道如何使用 IMGX
  - 不要提供不完整的示例

  **Parallelizable**: NO (依赖 Task 5)

  **References**:

  **工作流程参考**:
  - `pages/playground.vue` - 开发调试流程
  - `pages/template.vue` - 模板创建流程
  - `pages/preset.vue` - 预设创建流程
  - `README.md:118-168` - 模板和预设机制说明

  **端到端流程**:
  ```
  Playground 调试 → 复制 template + props → 模板编辑器录入 
    → 生成 propsSchema → 创建者勘误 → 保存模板
      → 预设编辑器 → 选择模板 → 配置默认值 → 生成预设码
        → GET API 使用
  ```

  **AI 应该询问的问题**:
  1. 主要用途是什么？（封面图、社交卡片、徽章等）
  2. 需要几个文本字段？（单标题、标题+副标题、多行等）
  3. 视觉风格偏好？（简约、粗体、渐变、带图标等）
  4. 是否支持图标/emoji？
  5. 固定颜色还是可自定义？
  6. 是否有参考设计？（图片 URL、描述、现有模板）

  **Acceptance Criteria**:

  **Manual Execution Verification**:
  - [ ] 命令: `type .opencode\skills\imgx-template-generator\SKILL.md | findstr "Workflow"`
  - [ ] 预期: 输出包含 "Workflow" 标题
  - [ ] 命令: `type .opencode\skills\imgx-template-generator\SKILL.md | findstr "Questions to ask"`
  - [ ] 预期: 输出包含问题清单
  - [ ] 命令: `type .opencode\skills\imgx-template-generator\SKILL.md | findstr "Next steps"`
  - [ ] 预期: 输出包含后续步骤说明
  - [ ] 手动检查: Workflow 部分包含 4 个阶段的详细说明
  - [ ] 手动检查: Examples 部分至少包含 1 个完整示例
  - [ ] 手动检查: 文档末尾有鼓励性总结（如 "Ready to generate..."）

  **Commit**: YES
  - Message: `feat(skill): add complete workflow, examples, and usage guide`
  - Files: `.opencode/skills/imgx-template-generator/SKILL.md`
  - Pre-commit: 无

---

- [ ] 7. 验证 skill 加载和权限配置

  **What to do**:
  - 重启 OpenCode 或重新加载配置
  - 验证 skill 出现在可用列表中:
    - 查看 `skill` tool 的 `<available_skills>` 部分
    - 确认包含 `imgx-template-generator` 条目
  - 测试加载 skill:
    - 调用: `skill({ name: "imgx-template-generator" })`
    - 确认完整内容正确显示
  - （可选）配置权限:
    - 如果需要限制访问，在 `opencode.json` 中添加权限规则
    - 例如: `"imgx-*": "ask"` 需要用户确认
  - 创建验证文档（可选）:
    - 记录 skill 加载成功的证据
    - 截图或日志输出

  **Must NOT do**:
  - 不要跳过实际测试
  - 不要假设 skill 自动生效（需要重启或重新加载）
  - 不要修改 skill 核心内容（除非发现错误）

  **Parallelizable**: NO (依赖 Task 6，且需要顺序验证)

  **References**:

  **OpenCode Skill 加载机制**:
  - 文档: https://opencode.ai/docs/skills/#understand-discovery
  - 搜索路径: `.opencode/skills/*/SKILL.md`
  - 加载时机: OpenCode 启动时或配置重新加载时

  **权限配置**（可选）:
  ```json
  {
    "permission": {
      "skill": {
        "imgx-*": "allow"
      }
    }
  }
  ```

  **测试命令**:
  - 列出所有 skills: 查看 agent 的 available_skills
  - 加载 skill: `skill({ name: "imgx-template-generator" })`

  **Acceptance Criteria**:

  **Manual Execution Verification**:
  - [ ] 重启 OpenCode: 关闭并重新打开应用
  - [ ] 打开项目目录: `cd W:\zzclub\imgx`
  - [ ] 与 AI 对话，检查 available_skills 列表是否包含 `imgx-template-generator`
  - [ ] 尝试加载 skill: 在对话中输入 "Load the imgx-template-generator skill"
  - [ ] 验证加载成功: AI 应该显示 skill 的完整内容
  - [ ] （可选）测试生成模板: 请 AI 使用 skill 生成一个简单的封面图模板

  **Commit**: NO (验证步骤，不需要提交)

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 2 | `feat(skill): add imgx-template-generator skill with frontmatter` | `.opencode/skills/imgx-template-generator/SKILL.md` | 文件存在且包含 frontmatter |
| 3 | `feat(skill): add Satori constraints and quality checklist` | `.opencode/skills/imgx-template-generator/SKILL.md` | 包含约束规则和检查清单 |
| 4 | `feat(skill): integrate Base.vue as standard reference template` | `.opencode/skills/imgx-template-generator/SKILL.md` | 包含 Base.vue 完整代码 |
| 5 | `feat(skill): add core design patterns for cover and social cards` | `.opencode/skills/imgx-template-generator/SKILL.md` | 包含至少 3 个设计模式 |
| 6 | `feat(skill): add complete workflow, examples, and usage guide` | `.opencode/skills/imgx-template-generator/SKILL.md` | 包含完整工作流程和示例 |

---

## Success Criteria

### Verification Commands

**检查 skill 文件存在**:
```bash
ls .opencode/skills/imgx-template-generator/SKILL.md
```
预期: 文件存在

**检查 frontmatter 完整性**:
```bash
head -n 10 .opencode/skills/imgx-template-generator/SKILL.md
```
预期: 包含完整的 YAML frontmatter（以 `---` 开始和结束）

**检查文档长度**:
```bash
wc -l .opencode/skills/imgx-template-generator/SKILL.md
```
预期: 至少 400+ 行（教程级别详细文档）

**验证 skill 加载** (需要重启 OpenCode):
1. 重启 OpenCode
2. 打开项目目录
3. 与 AI 对话，检查 available_skills 是否包含 `imgx-template-generator`
4. 请求加载 skill 并查看完整内容

### Final Checklist

- [ ] Skill 文件符合 OpenCode 命名规范
- [ ] Frontmatter 包含所有必需字段
- [ ] 包含完整的 Satori 约束说明
- [ ] 集成 Base.vue 作为标准示例
- [ ] 提供 3+ 个核心场景设计模式
- [ ] 包含 Props 分类指南
- [ ] 包含特殊语法说明
- [ ] 包含质量检查清单（10+ 条）
- [ ] 包含完整工作流程（4 阶段）
- [ ] 包含至少 1 个端到端示例
- [ ] 包含 "Next steps" 和 "Questions to ask"
- [ ] 文档语气适合开源分享（教程式、友好）
- [ ] Skill 能够被 OpenCode 成功加载
- [ ] 所有代码示例符合 Satori 约束
