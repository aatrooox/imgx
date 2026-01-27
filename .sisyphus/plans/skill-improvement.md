# IMGX SKILL.md 改进计划

## Context

### Original Request
用户希望改进 `.opencode/skills/imgx-template-generator/SKILL.md`，让 AI 生成模板时能遵守具体的尺寸、字号、布局约束，提高产出可用模板的成功率。

### Interview Summary
**Key Discussions**:
- 图片场景：文章封面（公众号/博客）、小红书竖版、小红书方图、OG Image
- 模板复杂度：标准（3-4 行文字：标题+副标题+正文/作者）
- 布局风格：卡片式（有边框、圆角、背景区分）
- 改进方案：组合"尺寸规格表 + 字号公式 + 布局蓝图"三管齐下
- 布局蓝图约束度：参考微调（AI 可微调细节，但不改变整体结构）
- 超长标题处理：缩小字号（简单策略）
- 无参考图回退：提供默认蓝图

**Research Findings**:
- 现有预设字号在 64-96px 之间，宽度主要 1200px 和 1080px
- 现有宽高比例约 16.7:1 (宽度:字号)
- Vercel OG 标准是 25:1，你的项目偏大字号但可接受
- Satori 约束：仅 Flexbox、无 box-shadow、字号必须用 px

### Metis Review
**Identified Gaps** (addressed):
- 缺少字数限制与字号关系 → 添加超长标题缩小 10-20% 策略
- 缺少无参考图回退 → 添加默认蓝图机制
- 布局蓝图约束不明确 → 确定为"参考微调"模式
- 缺少 AI 过度设计防护 → 添加明确禁止列表

---

## Work Objectives

### Core Objective
通过添加具体的尺寸规格表、字号公式、布局蓝图和检查清单，约束 AI 的模板生成行为，提高产出可用模板的成功率。

### Concrete Deliverables
- 更新后的 `.opencode/skills/imgx-template-generator/SKILL.md` 文件

### Definition of Done
- [ ] SKILL.md 包含 4 种场景的尺寸规格表（COVER, XHS_VERTICAL, XHS_SQUARE, OG_IMAGE）
- [ ] SKILL.md 包含字号计算公式（带示例）
- [ ] SKILL.md 包含至少 3 个布局蓝图（居中卡片、顶对齐列表、简约全屏）
- [ ] SKILL.md 包含生成前检查清单
- [ ] SKILL.md 包含超长标题处理策略（>25字缩小10-20%）
- [ ] SKILL.md 包含无参考图时的默认蓝图回退机制
- [ ] SKILL.md 包含 AI 行为禁止列表

### Must Have
- 场景规格表包含：尺寸、标题字号范围、副标题字号范围、正文字号范围、padding 值
- 布局蓝图包含：ASCII 图示、Vue 结构模板代码、适用场景说明
- 字号公式可计算、可验证
- 强制流程：场景选择 → 查表 → 选蓝图 → 生成 → 检查

### Must NOT Have (Guardrails)
- 不修改任何 `.vue` 模板文件
- 不修改任何 `.json` 预设文件
- 不修改 `lib/*.ts` 代码文件
- 不创建新文件（除 SKILL.md 外）
- 不修改 `AGENTS.md`
- 不添加超出 4 种场景的规格支持

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO (SKILL 是文档，无测试框架)
- **User wants tests**: Manual-only
- **Framework**: none

### Manual QA Verification

每个 TODO 完成后，需要手动验证：

1. **文档结构验证**：Read 修改后的 SKILL.md，确认各章节存在
2. **数值一致性验证**：检查规格表中的数值是否符合现有预设范围
3. **代码片段验证**：确认 Vue 结构模板代码符合 Satori 约束

---

## Task Flow

```
Task 1 (备份)
    ↓
Task 2 (添加场景规格表)
    ↓
Task 3 (添加字号公式)
    ↓
Task 4 (添加布局蓝图)
    ↓
Task 5 (添加检查清单和禁止列表)
    ↓
Task 6 (添加无参考图回退机制)
    ↓
Task 7 (最终验证)
```

---

## TODOs

- [ ] 1. 备份原始 SKILL.md

  **What to do**:
  - 读取 `.opencode/skills/imgx-template-generator/SKILL.md` 的当前内容
  - 复制到 `.opencode/skills/imgx-template-generator/SKILL.md.backup`

  **Must NOT do**:
  - 不要修改原文件内容

  **Parallelizable**: NO (后续任务依赖此备份)

  **References**:
  - 原文件: `.opencode/skills/imgx-template-generator/SKILL.md` (103行) - 完整内容需要读取以便理解现有结构

  **Acceptance Criteria**:
  - [ ] 备份文件存在且内容与原文件相同
  - [ ] 验证: `diff` 原文件和备份文件，应无差异

  **Commit**: NO (与 Task 7 一起提交)

---

- [ ] 2. 添加场景规格表

  **What to do**:
  - 在 SKILL.md 的 Instructions 部分之前，添加 "## ⚠️ 尺寸规格表（强制约束）" 章节
  - 包含 4 个场景的完整规格：

  ```yaml
  COVER (文章封面):
    尺寸: 1200 × 630
    标题: 64px (56-72px)
    副标题: 28px (24-32px)
    正文: 20px (18-24px)
    外层padding: 60px
    卡片内padding: 48px

  XHS_VERTICAL (小红书竖版):
    尺寸: 1080 × 1440
    标题: 80px (72-96px)
    副标题: 36px (32-40px)
    正文: 28px (24-32px)
    外层padding: 48px
    卡片内padding: 64px

  XHS_SQUARE (小红书方图):
    尺寸: 1080 × 1080
    标题: 72px (64-80px)
    副标题: 32px (28-36px)
    正文: 24px (20-28px)
    外层padding: 48px
    卡片内padding: 56px

  OG_IMAGE (Open Graph):
    与 COVER 相同规格
  ```

  - 添加超长标题处理策略：
    - 16-25字：字号缩小 10%
    - \>25字：字号缩小 20%

  **Must NOT do**:
  - 不要删除现有的 Satori 约束章节

  **Parallelizable**: NO (需要先完成备份)

  **References**:
  - 现有预设数据 (从分析中获取):
    - `presets/001.json`: 1200×630, fontSizes: ["72px"]
    - `presets/002.json`: 1200×630, fontSizes: ["80px"]
    - `presets/003.json`: 1080×1440, fontSizes: ["96px", "36px", "32px"]
    - `presets/004.json`: 1200×630, fontSizes: ["72px"]
    - `presets/005.json`: 1410×600, fontSizes: ["64px"]
  - Draft 文件: `.sisyphus/drafts/skill-improvement.md` - 包含完整规格表设计

  **Acceptance Criteria**:
  - [ ] 规格表包含全部 4 种场景
  - [ ] 每个场景包含：尺寸、标题/副标题/正文字号范围、padding 值
  - [ ] 包含超长标题缩小策略

  **Commit**: NO (与 Task 7 一起提交)

---

- [ ] 3. 添加字号计算公式

  **What to do**:
  - 在规格表章节之后，添加 "## 📐 字号计算公式（备用验证）" 章节
  - 包含以下公式：

  ```javascript
  // 基准边 = 较小的边
  const baseSize = Math.min(width, height)

  // 字号计算
  const titleSize = Math.round(baseSize / 9)      // 约 11%
  const subtitleSize = Math.round(baseSize / 20)  // 约 5%
  const bodySize = Math.round(baseSize / 26)      // 约 4%

  // 间距计算
  const outerPadding = Math.round(baseSize * 0.05)
  const innerPadding = Math.round(baseSize * 0.04)
  ```

  - 添加验证示例说明公式如何与规格表对应

  **Must NOT do**:
  - 不要让公式覆盖规格表（规格表优先）

  **Parallelizable**: NO (需要先完成 Task 2)

  **References**:
  - Vercel OG 研究: 1200×630 + 48px = 25:1 比例
  - 现有项目: 1200:72 = 16.7:1 比例
  - Draft 文件中的公式设计

  **Acceptance Criteria**:
  - [ ] 公式可执行（有 JavaScript 语法）
  - [ ] 提供至少 2 个验证示例
  - [ ] 明确说明"规格表优先，公式用于验证"

  **Commit**: NO (与 Task 7 一起提交)

---

- [ ] 4. 添加布局蓝图

  **What to do**:
  - 添加 "## 🎨 布局蓝图（参考微调）" 章节
  - 包含 3 个布局蓝图：

  **蓝图 A: 居中卡片（推荐默认）**
  - ASCII 图示
  - 适用场景：文章封面、OG Image
  - Vue 结构模板代码

  **蓝图 B: 顶对齐列表卡片**
  - ASCII 图示
  - 适用场景：小红书竖版、知识卡片
  - Vue 结构模板代码

  **蓝图 C: 简约全屏**
  - ASCII 图示
  - 适用场景：极简封面、强调单句
  - Vue 结构模板代码

  - 添加说明："AI 可微调对齐方式、颜色、间距等细节，但不可改变整体结构"

  **Must NOT do**:
  - 不要添加超过 4 个蓝图（保持简单）
  - 不要在蓝图中使用禁用的 CSS 属性

  **Parallelizable**: NO (需要先完成 Task 3)

  **References**:
  - 现有模板结构:
    - `components/template/Base.vue:26-45` - 居中布局模式
    - `components/template/ArticleCover.vue:22-75` - 横版布局模式
    - `components/template/SocialVertical.vue:31-121` - 竖版卡片布局模式
  - Draft 文件中的蓝图设计

  **Acceptance Criteria**:
  - [ ] 3 个蓝图各有 ASCII 图示
  - [ ] 3 个蓝图各有 Vue 代码模板
  - [ ] 每个蓝图有明确的适用场景
  - [ ] Vue 代码符合 Satori 约束（每个 div 有 flex）

  **Commit**: NO (与 Task 7 一起提交)

---

- [ ] 5. 添加检查清单和禁止列表

  **What to do**:
  - 添加 "## ✅ 生成检查清单" 章节，包含：

  ```markdown
  生成模板前，必须完成以下检查：
  □ 1. 已确认场景类型（COVER/XHS_VERTICAL/XHS_SQUARE/OG_IMAGE）
  □ 2. 已查阅规格表获取尺寸和字号
  □ 3. 已选择布局蓝图（A/B/C）
  □ 4. 字号使用规格表数值（不是自己算的）
  □ 5. 所有字号带 px 单位
  □ 6. 所有 div 有 class="flex"
  □ 7. 无禁用 CSS 属性
  □ 8. 超长标题已处理（>25字缩小20%）

  生成后，必须声明：
  - 场景：[场景名]
  - 规格：[宽度]×[高度]
  - 蓝图：[A/B/C]
  - 标题字号：[xx]px
  ```

  - 添加 AI 行为禁止列表：

  ```markdown
  ## ❌ AI 行为禁止列表
  1. 不得使用低于 24px 的字号
  2. 不得使用超过 4 种字号层级
  3. 不得在横版使用超过 100px 的标题字号
  4. 不得同时使用超过 3 种非渐变色
  5. padding 不得超过短边的 15%
  6. flex 嵌套不得超过 3 层
  7. 每行最多 1 处强调色
  ```

  **Must NOT do**:
  - 不要添加无法手动验证的检查项

  **Parallelizable**: NO (需要先完成 Task 4)

  **References**:
  - 现有 Satori 约束章节: `SKILL.md:74-98` - 禁用 CSS 列表
  - Metis 分析的 AI 过度设计风险

  **Acceptance Criteria**:
  - [ ] 检查清单包含至少 8 项
  - [ ] 每项检查可手动验证
  - [ ] 禁止列表包含具体数值限制

  **Commit**: NO (与 Task 7 一起提交)

---

- [ ] 6. 添加无参考图回退机制

  **What to do**:
  - 修改 "### 1. 图片参考检查" 章节，添加回退机制：

  ```markdown
  **如果用户坚持不提供图片**，可使用默认蓝图：
  1. 询问用户选择场景类型（COVER/XHS_VERTICAL/XHS_SQUARE/OG_IMAGE）
  2. 提供 2 个默认选项：
     - 选项 A：居中卡片 + 浅色背景 + 深色文字
     - 选项 B：简约全屏 + 渐变背景 + 白色文字
  3. 用户选择后，使用规格表数值 + 默认蓝图生成模板
  ```

  - 添加默认颜色方案：
    - 浅色方案：bg=#f8fafc, text=#0f172a, accent=#3b82f6
    - 深色方案：bg=#1a1a1a, text=#ffffff, accent=#0088a9

  **Must NOT do**:
  - 不要完全删除"必须提供图片"的提示（保留为首选）

  **Parallelizable**: NO (需要先完成 Task 5)

  **References**:
  - 现有拒绝逻辑: `SKILL.md:31-42` - 当前无回退
  - 现有预设颜色:
    - `presets/001.json:12-14`: bgColor="#1a1a1a", colors=["#ffffff"]
    - `presets/004.json:12-14`: bgColor="#f8fafc", colors=["#0f172a"]

  **Acceptance Criteria**:
  - [ ] 无参考图时有明确的回退流程
  - [ ] 提供至少 2 个默认选项
  - [ ] 默认选项与现有预设风格一致

  **Commit**: NO (与 Task 7 一起提交)

---

- [ ] 7. 最终验证和提交

  **What to do**:
  - 读取完整的 SKILL.md，验证所有章节存在
  - 检查 Satori 约束章节未被删除
  - 检查文档结构清晰、无重复章节
  - 删除 `.opencode/skills/imgx-template-generator/SKILL.md.backup`（如果确认无误）
  - 提交更改

  **Must NOT do**:
  - 不要在验证前删除备份

  **Parallelizable**: NO (最后一步)

  **References**:
  - 完整的 SKILL.md 新结构应包含：
    1. 原有 Role 和 Capabilities
    2. 新增 "尺寸规格表" 章节
    3. 新增 "字号计算公式" 章节
    4. 新增 "布局蓝图" 章节
    5. 修改后的 Instructions（含回退机制）
    6. 新增 "生成检查清单" 章节
    7. 新增 "AI 行为禁止列表" 章节
    8. 原有 Satori 约束章节

  **Acceptance Criteria**:
  - [ ] SKILL.md 包含全部 8 个主要章节
  - [ ] 文档格式正确（Markdown 渲染无误）
  - [ ] 无重复内容
  - [ ] Satori 约束章节完整保留

  **Manual Verification**:
  - 读取 SKILL.md 全文
  - 检查目录结构
  - 验证代码块语法高亮正确

  **Commit**: YES
  - Message: `docs(skill): 改进 IMGX 模板生成器 SKILL，添加尺寸规格表和布局蓝图`
  - Files: `.opencode/skills/imgx-template-generator/SKILL.md`
  - Pre-commit: 无（文档文件）

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 7 | `docs(skill): 改进 IMGX 模板生成器 SKILL，添加尺寸规格表和布局蓝图` | SKILL.md | 手动 Read 验证结构 |

---

## Success Criteria

### Verification Commands
```bash
# 检查文件存在
ls -la .opencode/skills/imgx-template-generator/SKILL.md

# 检查文件行数（应该明显增加，原 103 行，预计 300+ 行）
wc -l .opencode/skills/imgx-template-generator/SKILL.md
```

### Final Checklist
- [ ] 规格表包含 4 种场景的完整数值
- [ ] 字号公式可执行、有验证示例
- [ ] 3 个布局蓝图各有 ASCII 图和 Vue 代码
- [ ] 检查清单包含 8+ 项
- [ ] 禁止列表包含具体数值
- [ ] 无参考图回退机制有 2 个默认选项
- [ ] 原有 Satori 约束章节保留
- [ ] 文档 Markdown 格式正确
