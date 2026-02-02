## Task Execution Learnings

### Challenge: Subagent Edit Failures
- **Issue**: Delegated writing agent failed to modify SKILL.md twice
- **Root Cause**: Agent claimed completion but made no changes
- **Solution**: Orchestrator took direct control using bash heredoc + file concatenation
- **Pattern**: For critical documentation updates, direct bash editing is more reliable than delegation

### Successful Approach
Used bash with heredoc pattern:
```bash
head -N file > file.tmp
cat >> file.tmp << 'HEREDOC'
[new content]
HEREDOC
tail -n +N file >> file.tmp
mv file.tmp file
```

### File Modification Stats
- Original: 103 lines
- Final: 455 lines
- Growth: 342% (352 lines added)

### Sections Added Successfully
1. ⚠️ 尺寸规格表（强制约束） - 4 scene specifications
2. 📐 字号计算公式（备用验证） - JavaScript formulas
3. 🎨 布局蓝图（参考微调） - 3 blueprints with ASCII diagrams and Vue code
4. ✅ 生成检查清单 - 8-point checklist
5. ❌ AI 行为禁止列表 - 8 prohibitions
6. Fallback mechanism - 2 default options when no reference image

### Quality Check Passed
- ✓ All 9 main sections present
- ✓ Satori constraints preserved
- ✓ YAML blocks properly formatted
- ✓ Vue code examples符合 Satori requirements (flex classes)

## Satori backgroundImage Data URL Parsing Research

### Key Finding: Quote Stripping in URL Parsing

**Evidence** ([resolveImageData function](https://github.com/vercel/satori/blob/6203e8702acf5ec66c551d01eb46e544c30c1306/src/handler/image.ts#L157-L162)):
```typescript
if (
  (src.startsWith('"') && src.endsWith('"')) ||
  (src.startsWith("'") && src.endsWith("'"))
) {
  src = src.slice(1, -1)
}
```

**Explanation**: Satori strips surrounding quotes from URLs before processing. This happens AFTER the `url()` wrapper is removed.

### URL Extraction from backgroundImage

**Evidence** ([background-image.ts](https://github.com/vercel/satori/blob/6203e8702acf5ec66c551d01eb46e544c30c1306/src/builder/background-image.ts#L120-L129)):
```typescript
if (image.startsWith('url(')) {
  const dimensionsWithoutFallback = parseLengthPairs(size, {
    x: width,
    y: height,
    defaultX: 0,
    defaultY: 0,
  })
  const [src, imageWidth, imageHeight] = await resolveImageData(
    image.slice(4, -1)  // Removes "url(" prefix and ")" suffix
  )
```

**Explanation**: Satori extracts the URL by slicing off `url(` and `)`, then passes the inner content to `resolveImageData`.

### Parsing Flow

1. **CSS parsing**: `css-background-parser` parses `backgroundImage` property (line 7, 360)
2. **URL extraction**: Slices `url(...)` → content between parentheses (line 128)
3. **Quote stripping**: Removes surrounding quotes if present (lines 157-162)
4. **Data URI parsing**: Regex parses `data:image/...;base64,...` (lines 172-219)

### Known Issues with Data URLs

**Issue #304** ([Background Image missing when Data URI is specified](https://github.com/vercel/satori/issues/304)):
- Background images with data URIs not displaying correctly
- Related to parsing edge cases

**Issue #609** ([Error: t is undefined with base64-encoded background-image](https://github.com/vercel/satori/issues/609)):
- `TypeError: t is undefined` when using base64 in backgroundImage
- Suggests internal parsing failure with certain data URL formats

### Correct Format for backgroundImage with Data URLs

Based on source code analysis:

✅ **CORRECT**: `backgroundImage: url(data:image/png;base64,...)` (no quotes around data URL)
✅ **CORRECT**: `backgroundImage: 'url(data:image/png;base64,...)'` (quotes around entire value)
✅ **CORRECT**: `backgroundImage: "url(data:image/png;base64,...)"` (quotes around entire value)

❌ **AVOID**: `backgroundImage: url("data:image/png;base64,...")` (quotes inside url())
- While this gets stripped, it's non-standard

### Recommendation

Use template literal without quotes inside `url()`:
```typescript
backgroundImage: `url(data:image/png;base64,${base64Data})`
```

This follows standard CSS syntax and avoids quote-stripping edge cases.

