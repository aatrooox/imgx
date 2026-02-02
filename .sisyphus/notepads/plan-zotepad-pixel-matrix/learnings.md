## 2026-02-02 - ZOTEPAD Pixel Matrix Implementation

### Summary
Successfully created preset 106 with ZOTEPAD pixel matrix template where letter "O" is completely filled with emoji.

### Implementation Details
1. **ZOTEPAD_EMOJI_MATRIX constant** - Added to `server/templates/PixelMatrix.ts`
   - 5 rows × 41 columns matrix
   - 7 letters: Z, O, T, E, P, A, D
   - Letter O: Completely filled with `twemoji:star-struck` (25 emoji cells in 5×5 grid)
   - Other letters: Solid hex colors (Z=#9B59B6, T=#1ABC9C, E=#E67E22, P=#E91E63, A=#00BCD4, D=#F1C40F)

2. **Conditional matrix selection** - Updated `server/utils/image.ts`
   - Added ZOTEPAD_EMOJI_MATRIX to imports
   - Added preset code check: `if (preset.code === '106')` to select appropriate matrix
   - Maintains backward compatibility with preset 105 (IMGX)

3. **Preset configuration** - Created `presets/106.json`
   - Width: 1200px, Height: 510px (2.35:1 ratio for WeChat covers)
   - pixelSize: 22px (smaller than IMGX's 30px to fit 41 columns)
   - pixelGap: 3px, pixelRounded: 4px
   - Dark background: #1a1a2e
   - No dynamic content (contentKeys is empty)

### Verification
- ✅ Build successful (0 errors, 0 warnings related to changes)
- ✅ LSP diagnostics clean on all modified files
- ✅ Matrix dimensions verified: 5 rows × 41 columns
- ✅ Letter O emoji count verified: 25 cells
- ✅ API endpoint `/api/106/default` tested: Returns 12.7KB PNG (1200×510px)
- ✅ Preset appears in `/api/presets` list

### Key Learnings
- **Server Assets**: Presets in `presets/` directory are loaded via Nitro serverAssets with `assets:presets` storage key
- **Build Required**: New preset files require `pnpm build` to be included in `.output/server/chunks/raw/`
- **Route Structure**: API route is `/api/{presetCode}/default` not `/{presetCode}/default`
- **Matrix Sizing**: For 41 columns with pixelSize=22 and pixelGap=3: 41×22 + 40×3 + 120 padding = 1142px (fits in 1200px width)

### Files Modified
- `server/templates/PixelMatrix.ts` - Added ZOTEPAD_EMOJI_MATRIX export (lines 19-33)
- `server/utils/image.ts` - Updated import + added preset code 106 conditional logic (lines 7, 60-66)
- `presets/106.json` - Created new preset configuration

### Testing
```bash
# Successful test
curl -o test.png http://localhost:3000/api/106/default
file test.png
# Output: PNG image data, 1200 x 510, 8-bit/color RGBA
```

## [2026-02-02 18:00] Emoji Library Expansion

### Problem Solved
- **Original Issue**: `twemoji:star-struck` emoji was not rendering (returned null)
- **Root Cause**: Using limited local JSON file `assets/icons/twemoji-face-icons.json` (only 138 face icons)
- **Solution**: Switched to `@iconify-json/twemoji/icons.json` package (4169 total icons)

### Changes Made
1. **lib/icons.ts**: Changed import from local JSON to `@iconify-json/twemoji/icons.json`
2. **server/templates/PixelMatrix.ts**: Reverted ZOTEPAD matrix to use `twemoji:star-struck` (🤩)

### Technical Details
- **Package**: `@iconify-json/twemoji` v4.22.0 (already installed in project)
- **Icon Count**: 138 → 4169 (30x increase)
- **File Size**: `node_modules/@iconify-json/twemoji/icons.json` is 10MB+
- **Build Status**: Needs verification after deployment

### Available Emoji Now
All Twemoji icons are now accessible, including:
- ✅ `star-struck` (🤩) - originally intended for ZOTEPAD
- ✅ `smiling-face-with-heart-eyes` (😍) - temporary workaround
- ✅ All other Twemoji icons from Iconify

### Potential Concerns
- **Bundle Size**: Large JSON file may impact build output size
- **Build Time**: Importing 10MB JSON may slow down builds
- **Tree-shaking**: Vite/Rollup may not tree-shake unused icons

### Next Steps
1. Deploy and test if `@iconify-json/twemoji` import works in production build
2. Verify preset 106 renders with star-struck emoji correctly
3. Check if preset 105 (IMGX) also benefits from expanded library
4. Monitor build output size and consider optimization if needed

