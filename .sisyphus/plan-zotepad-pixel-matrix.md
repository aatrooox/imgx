# Plan: ZOTEPAD Pixel Matrix Template

## Goal
Create a new pixel matrix template that renders the word **"ZOTEPAD"** using emoji and colors, where the letter **O is completely filled with emoji** (not just an outline).

---

## Tasks

### Task 1: Add ZOTEPAD_EMOJI_MATRIX to PixelMatrix.ts

**File:** `server/templates/PixelMatrix.ts`

**Action:** Add the following constant BEFORE `IMGX_LETTERS_EMOJI_MATRIX`:

```typescript
// ZOTEPAD 字母 Emoji 版本 - 7个字母，O 完全填满 emoji
// 每个字母 5 列宽，字母之间 1 列间隔
// Z = 紫色, O = 🤩 星星眼 (填满), T = 蓝绿色, E = 橙色, P = 粉色, A = 青色, D = 黄色
export const ZOTEPAD_EMOJI_MATRIX = [
  // Row 1: Z O T E P A D
  ['#9B59B6', '#9B59B6', '#9B59B6', '#9B59B6', '#9B59B6', '', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', '', '#1ABC9C', '#1ABC9C', '#1ABC9C', '#1ABC9C', '#1ABC9C', '', '#E67E22', '#E67E22', '#E67E22', '#E67E22', '#E67E22', '', '#E91E63', '#E91E63', '#E91E63', '#E91E63', '', '', '', '#00BCD4', '#00BCD4', '#00BCD4', '', '', '#F1C40F', '#F1C40F', '#F1C40F', '#F1C40F', ''],
  // Row 2
  ['', '', '', '', '#9B59B6', '', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', '', '', '', '#1ABC9C', '', '', '', '#E67E22', '', '', '', '', '', '#E91E63', '', '', '', '#E91E63', '', '#00BCD4', '', '', '', '#00BCD4', '', '#F1C40F', '', '', '', '#F1C40F'],
  // Row 3
  ['', '', '', '#9B59B6', '', '', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', '', '', '', '#1ABC9C', '', '', '', '#E67E22', '#E67E22', '#E67E22', '#E67E22', '', '', '#E91E63', '#E91E63', '#E91E63', '#E91E63', '', '', '#00BCD4', '#00BCD4', '#00BCD4', '#00BCD4', '#00BCD4', '', '#F1C40F', '', '', '', '#F1C40F'],
  // Row 4
  ['', '', '#9B59B6', '', '', '', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', '', '', '', '#1ABC9C', '', '', '', '#E67E22', '', '', '', '', '', '#E91E63', '', '', '', '', '', '#00BCD4', '', '', '', '#00BCD4', '', '#F1C40F', '', '', '', '#F1C40F'],
  // Row 5: Z O T E P A D 底部
  ['#9B59B6', '#9B59B6', '#9B59B6', '#9B59B6', '#9B59B6', '', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', 'twemoji:star-struck', '', '', '', '#1ABC9C', '', '', '', '#E67E22', '#E67E22', '#E67E22', '#E67E22', '#E67E22', '', '#E91E63', '', '', '', '', '', '#00BCD4', '', '', '', '#00BCD4', '', '#F1C40F', '#F1C40F', '#F1C40F', '#F1C40F', ''],
]
```

**Visual representation of the matrix:**
```
Z     O(filled)  T     E     P     A     D
█████ 🤩🤩🤩🤩🤩 █████ █████ ████  ███   ████
    █ 🤩🤩🤩🤩🤩   █   █     █  █ █   █ █   █
   █  🤩🤩🤩🤩🤩   █   ████  ████ █████ █   █
  █   🤩🤩🤩🤩🤩   █   █     █    █   █ █   █
█████ 🤩🤩🤩🤩🤩   █   █████ █    █   █ ████
```

**Verification:**
- Each row has exactly 41 columns
- O letter is fully filled (5×5 = 25 emoji cells)
- Colors: Z=purple(#9B59B6), T=teal(#1ABC9C), E=orange(#E67E22), P=pink(#E91E63), A=cyan(#00BCD4), D=yellow(#F1C40F)

---

### Task 2: Update image.ts with preset code 106 logic

**File:** `server/utils/image.ts`

**Action 1:** Update the import statement at line 7:

Change:
```typescript
import { PixelMatrixTemplate, IMGX_LETTERS_MATRIX, IMGX_LETTERS_EMOJI_MATRIX } from '../templates/PixelMatrix'
```

To:
```typescript
import { PixelMatrixTemplate, IMGX_LETTERS_MATRIX, IMGX_LETTERS_EMOJI_MATRIX, ZOTEPAD_EMOJI_MATRIX } from '../templates/PixelMatrix'
```

**Action 2:** Update the PixelMatrix handling logic (around line 60-75):

Change:
```typescript
  if (template === 'PixelMatrix') {
    contentFinalProps.characterMatrix = IMGX_LETTERS_EMOJI_MATRIX
```

To:
```typescript
  if (template === 'PixelMatrix') {
    // Select matrix based on preset code
    if (preset.code === '106') {
      contentFinalProps.characterMatrix = ZOTEPAD_EMOJI_MATRIX
    } else {
      contentFinalProps.characterMatrix = IMGX_LETTERS_EMOJI_MATRIX
    }
```

---

### Task 3: Create presets/106.json

**File:** `presets/106.json` (new file)

**Content:**
```json
{
  "code": "106",
  "name": "Pixel Matrix - ZOTEPAD",
  "description": "像素方格矩阵 - ZOTEPAD 字母，O填满emoji",
  "width": 1200,
  "height": 510,
  "ratio": "2.35:1",
  "template": "PixelMatrix",
  "contentProps": {},
  "styleProps": {
    "bgColor": "#1a1a2e",
    "fontFamily": "YouSheBiaoTiHei",
    "padding": "60px",
    "pixelSize": 22,
    "pixelGap": 3,
    "pixelRounded": 4
  },
  "contentKeys": ""
}
```

**Sizing calculation:**
- Matrix: 41 columns × 5 rows
- pixelSize=22, pixelGap=3
- Width: 41×22 + 40×3 + 120 padding = 902 + 120 + 120 = 1142px (fits in 1200px)
- Height: 5×22 + 4×3 + 120 padding = 110 + 12 + 120 = 242px (centered in 510px)

---

### Task 4: Build and verify

**Commands:**
```bash
pnpm run build
pnpm dev
# In another terminal:
curl http://localhost:4573/api/106/default --output zotepad.png
```

**Expected output:**
- PNG image showing "ZOTEPAD" in pixel art style
- Letter O should be completely filled with 🤩 (star-struck) emoji
- Other letters in solid colors

---

## Summary

| Step | File | Action |
|------|------|--------|
| 1 | server/templates/PixelMatrix.ts | Add `ZOTEPAD_EMOJI_MATRIX` constant |
| 2 | server/utils/image.ts | Update import + add preset code 106 logic |
| 3 | presets/106.json | Create new preset file |
| 4 | Terminal | Build and test |

## Test Commands

```bash
# Build project
pnpm run build

# Start dev server  
pnpm dev

# Test endpoint (in another terminal)
curl http://localhost:4573/api/106/default --output zotepad.png
open zotepad.png  # or xdg-open on Linux
```
