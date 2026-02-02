# Scale Parameter Implementation - Verification Checklist

## ✅ Files Modified

### 1. `server/utils/image.ts`
- [x] Added `scale?: number` to `GenerateImageOptions` interface (line 15)
- [x] Updated function signature with `scale = 1` parameter (line 36)
- [x] Modified Resvg fitTo configuration:
  - [x] Uses `mode: 'original'` when scale === 1 (line 145)
  - [x] Uses `mode: 'zoom'` with value when scale !== 1 (line 145-146)

### 2. `server/api/[presetCode]/[...text].get.ts`
- [x] Parse scale from query params (line 21-22)
- [x] Validate scale range 0.5-5 (line 23-25)
- [x] Pass scale to generateImage() call (line 109)
- [x] Include scale in ETag calculation (line 122)
- [x] Delete scale from customStyleProps to prevent double processing

### 3. `server/api/[presetCode]/default.get.ts`
- [x] Parse scale from query using getQuery() (line 12-13)
- [x] Validate scale range 0.5-5 (line 14-16)
- [x] Pass scale to generateImage() call (line 27)
- [x] Include scale in ETag calculation (line 32)

### 4. `server/api/[presetCode]/index.post.ts`
- [x] Parse scale from request body (line 63)
- [x] Validate scale range 0.5-5 (line 64-66)
- [x] Pass scale to generateImage() call (line 126)
- [x] Include scale in ETag calculation (line 140)

## ✅ Functionality Requirements

- [x] Accept `?scale=2` or `?scale=3` in URL query params
- [x] Accept `scale` in POST request body
- [x] Default to `scale=1` if not provided
- [x] Validate scale range: 0.5 to 5
- [x] Pass scale to Resvg with `fitTo.mode: 'zoom'`
- [x] Include scale in ETag calculation for proper caching

## ✅ Build Verification

- [x] `pnpm run build` passes successfully
- [x] No TypeScript compilation errors
- [x] Nitro server builds without errors
- [x] No breaking changes to existing functionality

## ✅ Test Cases Ready

### URL Test Cases
- `/api/104/default?scale=2` - Returns 2x image (should be ~2400×1020)
- `/api/104/default?scale=3` - Returns 3x image (should be ~3600×1530)
- `/api/104/default` - Returns standard image (should be ~1200×510)
- `/api/104/default?scale=0.3` - Should return 400 error (below minimum)
- `/api/104/default?scale=6` - Should return 400 error (above maximum)

### POST Test Cases
- POST with `{"scale": 2}` - Returns 2x image
- POST with `{"scale": 3}` - Returns 3x image
- POST without scale - Defaults to 1x image

## ✅ ETag Behavior

- [x] ETag changes when scale parameter changes
- [x] ETag persists scale value in base64 hash
- [x] HTTP 304 Not Modified works correctly with scale parameter
- [x] Different scale values produce different cache keys

## Notes

- Scale parameter is OPTIONAL (doesn't break existing URLs)
- Scale parameter is NOT added to style props (proper separation of concerns)
- Resvg handles scaling at PNG generation time (efficient)
- No changes to preset JSON or template files
- No changes to Satori rendering logic
