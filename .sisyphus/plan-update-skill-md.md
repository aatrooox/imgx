# Plan: Update SKILL.md with Pixel Matrix Blueprint

## Goal
Add the Pixel Matrix blueprint (`blueprint-pixel-matrix.md`) to the IMGX Template Generator skill documentation so it's discoverable alongside other blueprints.

---

## Tasks

### Task 1: Update Blueprint Selection Table in SKILL.md
**File:** `.opencode/skills/imgx-template-generator/SKILL.md`  
**Lines:** 37-43

**Current state (5 blueprints):**
```markdown
| 蓝图类型 | 适用场景 | 阅读时长 | 文档链接 |
|---------|---------|---------|---------|
| 📝 **简单文本** | 单行/多行纯文本，统一样式，居中布局 | 5 分钟 | [blueprint-simple-text.md](references/blueprint-simple-text.md) |
| 📋 **多行布局** | 多行文本，每行不同颜色/大小/对齐方式 | 6 分钟 | [blueprint-multi-line.md](references/blueprint-multi-line.md) |
| 🎨 **强调文本** | 需要高亮关键词（背景盒子/特殊颜色） | 7 分钟 | [blueprint-with-accent.md](references/blueprint-with-accent.md) |
| 🌈 **渐变背景** | 使用线性/径向渐变，复杂背景效果 | 6 分钟 | [blueprint-with-gradient.md](references/blueprint-with-gradient.md) |
| 🎯 **带图标** | 需要显示图标/emoji/装饰元素 | 7 分钟 | [blueprint-with-icons.md](references/blueprint-with-icons.md) |
```

**Add new row (6th blueprint):**
```markdown
| 🧱 **像素矩阵** | 像素艺术风格，用 emoji/颜色拼成文字或图案 | 5 分钟 | [blueprint-pixel-matrix.md](references/blueprint-pixel-matrix.md) |
```

---

### Task 2: Update Decision Tree in SKILL.md
**File:** `.opencode/skills/imgx-template-generator/SKILL.md`  
**Lines:** ~491-509 (Decision Tree section)

**Add new question before the final fallback:**

Insert before "问题 4":
```markdown
问题 4: 是否需要像素艺术风格（用色块/emoji拼成图案）？
  ├─ 是 → 🧱 使用 blueprint-pixel-matrix.md
  └─ 否 → 继续
```

Then renumber existing "问题 4" to "问题 5".

---

### Task 3: Update Document Index in SKILL.md
**File:** `.opencode/skills/imgx-template-generator/SKILL.md`  
**Lines:** ~420-425 (模板蓝图 section)

**Add new entry:**
```markdown
- [像素矩阵模板](references/blueprint-pixel-matrix.md)
```

---

### Task 4: Update Statistics in SKILL.md
**File:** `.opencode/skills/imgx-template-generator/SKILL.md`  
**Lines:** ~520-527 (文档统计 section)

**Update counts:**
- **总文档数**: 14 个 → 15 个  
- **蓝图库**: 5 个 → 6 个

---

## Verification

After making changes:
1. Build should still pass: `pnpm run build`
2. All markdown links should work
3. The 6 blueprint types should be listed consistently across:
   - Blueprint selection table
   - Decision tree
   - Document index
   - Statistics

---

## Execution Command

```bash
/start-work
```
