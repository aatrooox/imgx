# Scale Parameter Implementation - Learnings

## Implementation Summary
Successfully added `scale` parameter support to enable 2x/3x high-resolution image output for Retina displays and printing.

## Key Changes

### 1. Image Generation Core (`server/utils/image.ts`)
- Added `scale?: number` to `GenerateImageOptions` interface
- Updated `generateImage()` function signature with `scale = 1` parameter
- Modified Resvg configuration to use `fitTo.mode: 'zoom'` when scale > 1
- Resvg configuration logic:
  ```typescript
  fitTo: {
    mode: scale === 1 ? 'original' : 'zoom',
    value: scale
  }
  ```

### 2. GET Endpoint with Dynamic Text (`server/api/[presetCode]/[...text].get.ts`)
- Parse scale from query parameters using `parseFloat()`
- Validation range: 0.5 to 5 (inclusive)
- Invalid scale returns 400 error with descriptive message
- Passed scale to `generateImage()` call
- Updated ETag calculation to include scale in hash

### 3. GET Default Endpoint (`server/api/[presetCode]/default.get.ts`)
- Similar implementation to dynamic text endpoint
- Parse scale from query using `getQuery(event).scale`
- Same validation logic
- Updated ETag to include scale value for proper cache invalidation

### 4. POST Endpoint (`server/api/[presetCode]/index.post.ts`)
- Parse scale from request body (`body.scale`)
- Same validation logic (0.5-5 range)
- Pass scale to `generateImage()` call
- Include scale in ETag calculation for POST responses

## Validation Rules
- **Range**: 0.5 to 5.0 (inclusive)
- **Default**: 1 (original size)
- **Valid Examples**: 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5
- **Invalid Examples**: 0.3 (< 0.5), 6 (> 5), "abc" (NaN)

## Resvg Integration
- When scale === 1: use `mode: 'original'` (no scaling)
- When scale !== 1: use `mode: 'zoom'` with the scale value
- Resvg properly scales PNG output without quality loss
- Output dimensions scale proportionally (e.g., 1200×510 → 2400×1020 for scale=2)

## Caching Strategy
- ETag now includes scale parameter in hash
- When scale changes, ETag changes automatically
- Client receives different ETag → browser doesn't use cached response
- Proper HTTP 304 Not Modified handling preserved

## Usage Examples
- GET: `/api/104/default?scale=2` → 2x resolution
- GET: `/api/104/default?scale=3` → 3x resolution
- POST: Include `"scale": 2` in JSON body

## Build Status
✅ Build completed successfully with no TypeScript errors
✅ All three API endpoints updated
✅ No breaking changes to existing functionality
✅ Scale parameter is optional (defaults to 1)
