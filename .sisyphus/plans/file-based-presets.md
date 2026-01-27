# File-Based Preset System - Remove Database Dependency

## Context

### Original Request
Remove all database dependencies (Prisma + MySQL) from IMGX project and implement a file-based preset system using JSON files. Make the project completely self-contained without external service dependencies.

### Previous Work
**Phase 1 Completed** (Commit: 6b6694d):
- Migrated HTML to PNG conversion logic from imgx-nitro to local server
- Created `server/utils/satori.ts` (271 lines) - Vue template rendering, Satori conversion, font loading
- Created `server/utils/image.ts` (54 lines) - PNG generation via Resvg
- Created `server/utils/icons.ts` (40 lines) - Icon to base64 conversion
- Updated `server/routes/[presetCode]/[...text].get.ts` to use local generation (still uses Prisma)

### Current Architecture Issues
- Uses Prisma ORM to query MySQL database for presets
- Proxies `/api/v1/**` routes to external imgx-nitro service on `localhost:5777`
- `server/utils/image.ts` accesses `preset.templateInfo.template` (Prisma structure)
- `server/routes/[presetCode]/default.get.ts` fully proxies to external service
- Template HTML is in `components/template/Base.vue` but needs to be accessible server-side

---

## Work Objectives

### Core Objective
Transform IMGX from a database-dependent proxy service into a fully self-contained file-based image generation API.

### Concrete Deliverables
1. `presets/` directory with JSON preset files (001.json, 002.json as examples)
2. `server/utils/preset.ts` - File-based preset loader with caching
3. Updated `server/utils/image.ts` with template string mapping
4. Updated route handlers without Prisma dependencies
5. Cleaned `nuxt.config.ts` without proxy configuration

### Definition of Done
- [ ] `curl http://localhost:4573/001/Hello` returns PNG image without database
- [ ] `curl http://localhost:4573/001/default` returns default preset image
- [ ] `curl http://localhost:4573/002/default` returns gradient preset image
- [ ] No connection attempts to `localhost:5777` or MySQL database
- [ ] Server starts successfully without Prisma connection errors
- [ ] ETag caching still works correctly

### Must Have
- File-based preset loading with in-memory caching
- Backward-compatible preset JSON structure
- Error SVG for non-existent presets
- Template string extraction from Base.vue
- Content parsing with special syntax support (`*accent*`, `[iconify:icon]`, `+` separator)

### Must NOT Have (Guardrails)
- **NO deletion of `lib/prisma.ts`** - Keep file, just stop importing it
- **NO removal of `server/utils/icons.ts`** - Preserve for future flexibility
- **NO changes to frontend components** - This is server-side only refactoring
- **NO changes to `components/template/Base.vue`** - Extract template, don't modify
- **NO cache invalidation mechanism in initial implementation** - Manual server restart for preset updates
- **NO dynamic preset creation API** - Read-only file-based system
- **NO migration of existing database presets** - Manual JSON creation only

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO (no automated tests in this project)
- **User wants tests**: Manual-only (as per AGENTS.md guidance)
- **Framework**: N/A
- **QA approach**: Manual verification via curl and dev server

### Manual QA Procedures

Each TODO includes detailed manual verification:

**For Backend API Changes:**
- **Tool**: curl command-line HTTP client
- **Verification**: Send GET requests, inspect response headers and body
- **Evidence**: Terminal output with status codes and content-type headers

**For Server Startup:**
- **Tool**: pnpm dev (Nuxt dev server)
- **Verification**: Server starts without errors, no database connection attempts
- **Evidence**: Terminal logs showing successful startup

**For Image Generation:**
- **Tool**: Browser or curl with output redirection
- **Verification**: Save generated images and visually inspect
- **Evidence**: Image files with correct dimensions and content

---

## Task Flow

```
Task 1 (Create presets) → Task 2 (Create loader)
                               ↓
Task 3 (Update image.ts) ← Task 2
                               ↓
Task 4 (Update [...text].get.ts) ← Task 3
                               ↓
Task 5 (Update default.get.ts) ← Task 4
                               ↓
Task 6 (Update nuxt.config.ts)
                               ↓
Task 7 (Test all endpoints) ← All tasks
                               ↓
Task 8 (Commit changes)
```

## Parallelization

| Group | Tasks | Reason |
|-------|-------|--------|
| Initial | 1, 2 | Can create presets and loader independently |

| Task | Depends On | Reason |
|------|------------|--------|
| 3 | 2 | Needs Preset type from preset.ts |
| 4 | 3 | Uses updated generateImage signature |
| 5 | 4 | Follows same pattern as [...text].get.ts |
| 6 | None | Independent config change |
| 7 | 1-6 | Tests require all changes complete |
| 8 | 7 | Commit after verification |

---

## TODOs

- [ ] 1. Create presets directory and example JSON files

  **What to do**:
  - Create `presets/` directory at project root
  - Create `presets/001.json` with simple text card preset
  - Create `presets/002.json` with gradient background preset
  - JSON structure must match interface: `code, name, description, template, width, height, contentProps, styleProps, contentKeys`

  **Must NOT do**:
  - Don't create presets for codes that conflict with existing database entries (if migration happens later)
  - Don't include invalid Tailwind classes in styleProps
  - Don't use template names other than "Base" (only template currently supported)

  **Parallelizable**: YES (with Task 2)

  **References**:

  **Preset Structure Pattern**:
  - `components/template/Base.vue:3-20` - componentBaseProps interface defines expected styleProps structure
  - `lib/content.ts:16-34` - componentBaseProps type shows all available props
  - `server/routes/[presetCode]/[...text].get.ts:26-39` - Current Prisma query structure shows what fields are accessed

  **Content Props Example**:
  - `lib/content.ts:74-116` - getParsedText() function shows expected content structure format
  - Expected structure: `{ content: [[{text: "string", type: "normal"|"accent"|"emoji", base64URL?: string}]] }`

  **Style Props Example**:
  - `components/template/Base.vue:5-19` - Default values for all styleProps
  - Available: bgColor, colors, accentColors, fontSizes, aligns, verticalAligns, fontFamily, padding, bgImage, textWrapBgColor, textWrapShadow, textWrapPadding, textWrapRounded

  **Preset JSON Template**:
  ```json
  {
    "code": "001",
    "name": "Simple Text Card",
    "description": "A simple card with centered text",
    "template": "Base",
    "width": 1200,
    "height": 630,
    "contentProps": {
      "content": [[{"text": "Hello IMGX", "type": "normal"}]]
    },
    "styleProps": {
      "bgColor": "#1a1a1a",
      "colors": ["#ffffff"],
      "accentColors": ["#0088a9"],
      "fontSizes": ["72px"],
      "aligns": ["justify-center"],
      "verticalAligns": ["center"],
      "fontFamily": "YouSheBiaoTiHei",
      "padding": "30px",
      "bgImage": "linear-gradient(to right, transparent, transparent)",
      "textWrapBgColor": "transparent",
      "textWrapShadow": "none",
      "textWrapPadding": "0px",
      "textWrapRounded": "none"
    },
    "contentKeys": "text"
  }
  ```

  **Acceptance Criteria**:

  **File Creation Verification**:
  - [ ] Directory exists: `ls presets` → shows directory
  - [ ] Files created: `ls presets/*.json` → shows 001.json, 002.json
  - [ ] JSON is valid: `node -e "console.log(JSON.parse(require('fs').readFileSync('presets/001.json')))"` → no syntax errors

  **Content Verification**:
  - [ ] 001.json contains: code="001", template="Base", width=1200, height=630
  - [ ] 002.json contains: code="002", template="Base", different bgImage with gradient
  - [ ] Both have contentKeys field: `cat presets/001.json | grep contentKeys` → shows field

  **Evidence Required**:
  - [ ] Terminal output from `ls presets/` and `cat presets/001.json`

  **Commit**: NO (groups with other tasks)

---

- [ ] 2. Create server/utils/preset.ts with file-based loader

  **What to do**:
  - Create `server/utils/preset.ts` file
  - Define `Preset` interface matching JSON structure
  - Implement `loadPresets()` - async function that reads all JSON files from presets/ directory
  - Implement `getPresetByCode(code: string)` - returns single preset or null
  - Implement `getAllPresets()` - returns array of all presets
  - Use `presetsCache` variable for in-memory caching
  - Use Node.js fs/promises APIs (`readdir`, `readFile`)

  **Must NOT do**:
  - Don't use Nuxt's `useStorage()` or `useFetch()` - use raw Node.js fs
  - Don't implement hot-reload or cache invalidation - manual restart required
  - Don't add validation beyond JSON.parse() - trust preset files are correct
  - Don't add preset creation/update/delete APIs - read-only system

  **Parallelizable**: YES (with Task 1)

  **References**:

  **Interface Definition**:
  - `server/routes/[presetCode]/[...text].get.ts:26-39` - Shows what fields are accessed from preset (code, contentKeys, templateInfo.template, templateInfo.propsSchema)
  - `lib/content.ts:16-34` - componentBaseProps type defines contentProps/styleProps structure
  - New structure simplifies: remove nested `templateInfo`, flatten to `template` field

  **File Loading Pattern**:
  - Node.js fs/promises documentation: Use `readdir()` to list .json files, `readFile()` to load content
  - Caching pattern: Global variable `presetsCache` initialized as `null`, populated on first call

  **Error Handling**:
  - If presets/ directory doesn't exist → return empty object
  - If JSON parse fails → skip that file, log warning
  - If preset has no `code` field → skip that file

  **Implementation Template**:
  ```typescript
  import { readdir, readFile } from 'node:fs/promises'
  import { join } from 'node:path'

  export interface Preset {
    code: string
    name: string
    description?: string
    template: string
    width: number
    height: number
    contentProps: Record<string, any>
    styleProps: Record<string, any>
    contentKeys: string
    propsSchema?: any[]
  }

  let presetsCache: Record<string, Preset> | null = null

  export async function loadPresets(): Promise<Record<string, Preset>> {
    if (presetsCache) return presetsCache
    
    presetsCache = {}
    const presetsDir = join(process.cwd(), 'presets')
    
    try {
      const files = await readdir(presetsDir)
      for (const file of files) {
        if (file.endsWith('.json')) {
          const content = await readFile(join(presetsDir, file), 'utf-8')
          const preset = JSON.parse(content) as Preset
          if (preset.code) {
            presetsCache[preset.code] = preset
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load presets:', error)
    }
    
    return presetsCache
  }

  export async function getPresetByCode(code: string): Promise<Preset | null> {
    const presets = await loadPresets()
    return presets[code] || null
  }

  export async function getAllPresets(): Promise<Preset[]> {
    const presets = await loadPresets()
    return Object.values(presets)
  }
  ```

  **Acceptance Criteria**:

  **File Creation**:
  - [ ] File exists: `ls server/utils/preset.ts` → shows file

  **Type Export**:
  - [ ] Contains Preset interface: `grep "export interface Preset" server/utils/preset.ts` → found

  **Function Exports**:
  - [ ] Contains loadPresets: `grep "export async function loadPresets" server/utils/preset.ts` → found
  - [ ] Contains getPresetByCode: `grep "export async function getPresetByCode" server/utils/preset.ts` → found
  - [ ] Contains getAllPresets: `grep "export async function getAllPresets" server/utils/preset.ts` → found

  **Evidence Required**:
  - [ ] Terminal output from grep commands showing function signatures

  **Commit**: NO (groups with other tasks)

---

- [ ] 3. Update server/utils/image.ts to use file-based Preset type

  **What to do**:
  - Import `Preset` type from `./preset` instead of using `any`
  - Add `templateStrings` constant object mapping template names to HTML strings
  - Extract HTML template from `components/template/Base.vue:26-45` (template section only, no script)
  - Update `GenerateImageOptions` interface to use imported `Preset` type
  - Change line 22: `preset.templateInfo.template` → `preset.template`
  - Get template HTML from `templateStrings[preset.template]` or fallback to `preset.template` directly

  **Must NOT do**:
  - Don't modify the template HTML structure - copy exactly from Base.vue
  - Don't change `generateImage()` function signature (keep compatible with existing callers)
  - Don't add template validation - trust template strings are correct
  - Don't remove error handling for missing presets

  **Parallelizable**: NO (depends on Task 2)

  **References**:

  **Template HTML Source**:
  - `components/template/Base.vue:26-45` - EXACT template HTML to extract
  - Must preserve: all `:style`, `:class`, `v-for`, `v-if` directives
  - Must preserve: Tailwind classes like `w-full`, `h-full`, `flex`, `items-center`, `justify-center`

  **Type Import Change**:
  - OLD: `interface GenerateImageOptions { preset: any ... }`
  - NEW: `import type { Preset } from './preset'` then `interface GenerateImageOptions { preset: Preset ... }`

  **Template Access Change**:
  - OLD (line 22): `const { template } = preset.templateInfo`
  - NEW: `const { template } = preset`

  **Template String Mapping**:
  ```typescript
  const templateStrings: Record<string, string> = {
    'Base': `<div class="w-full h-full flex items-center justify-center transition-all duration-300" ...>[FULL HTML FROM BASE.VUE]</div>`
  }

  // In generateImage function:
  const templateString = templateStrings[template] || template
  const vNode = await vueTemplateToSatori(templateString, {...})
  ```

  **Current File Structure** (for reference):
  - Lines 1-3: Imports
  - Lines 4-9: Interface definition
  - Lines 11-54: generateImage function

  **Acceptance Criteria**:

  **Import Change**:
  - [ ] File imports Preset type: `grep "import.*Preset.*from './preset'" server/utils/image.ts` → found

  **Template Strings Added**:
  - [ ] Contains templateStrings: `grep "const templateStrings" server/utils/image.ts` → found
  - [ ] Base template defined: `grep "'Base':" server/utils/image.ts` → found

  **Preset Access Updated**:
  - [ ] No templateInfo access: `grep "preset.templateInfo" server/utils/image.ts` → no results
  - [ ] Direct template access: `grep "preset.template" server/utils/image.ts` → found

  **File Still Compiles**:
  - [ ] No TypeScript errors: `pnpm nuxt typecheck` (or just start dev server) → no errors in this file

  **Evidence Required**:
  - [ ] Git diff showing templateStrings addition and type import

  **Commit**: NO (groups with other tasks)

---

- [ ] 4. Update server/routes/[presetCode]/[...text].get.ts to use file-based loader

  **What to do**:
  - Remove import: `import prisma from '~/lib/prisma'`
  - Add import: `import { getPresetByCode } from '~/server/utils/preset'`
  - Add import: `import { getParsedText } from '~/lib/content'`
  - Replace lines 26-39 (Prisma query) with: `const preset = await getPresetByCode(presetCode!)`
  - Remove lines 49 (destructuring `contentKeys`, `propsSchema` from `templateInfo`)
  - Change to: `const contentKeys = preset?.contentKeys || ''` and `const propsSchema = preset?.propsSchema || []`
  - Handle "text" contentKey specially: if contentKeys === "text", parse with `getParsedText()` and build content array

  **Must NOT do**:
  - Don't change query parameter parsing logic (lines 10-24)
  - Don't change ETag generation logic (lines 82-91)
  - Don't change response headers or caching behavior
  - Don't change error handling structure

  **Parallelizable**: NO (depends on Task 3)

  **References**:

  **Current Prisma Query** (lines 26-39):
  - Shows what fields are accessed: `code`, `templateInfo.contentKeys`, `templateInfo.propsSchema`, `templateInfo.template`
  - New structure: All these fields exist directly on Preset, except `template` (no templateInfo nesting)

  **Content Parsing Logic** (lines 51-66):
  - Currently: Splits text by `/`, maps to contentKeys array
  - NEW REQUIREMENT: For simple "text" contentKey, need to parse into content array structure
  - Use `getParsedText()` from `lib/content.ts:74-116` to handle special syntax

  **Special "text" ContentKey Handling**:
  ```typescript
  // For presets with contentKeys="text" (simple single-field text)
  if (contentKeysArray.length === 1 && contentKeysArray[0] === 'text') {
    // Join all path segments and split by '+' for multi-line
    const lines = contents.join('/').split('+')
    const parsedContent = lines.map(line => getParsedText(line))
    customContentProps.content = parsedContent
  } else {
    // Multi-field content (existing logic)
    contents.forEach((value: string, index: number) => {
      if (contentKeysArray[index]) {
        customContentProps[contentKeysArray[index]] = value
      }
    })
  }
  ```

  **Error Handling** (lines 41-47):
  - Keep same structure: if (!preset) return error SVG
  - No changes needed to error handling

  **Type Conversion** (lines 61-66):
  - Keep existing logic for converting size types to numbers
  - propsSchema is now optional, handle undefined case

  **Acceptance Criteria**:

  **Import Changes**:
  - [ ] No Prisma import: `grep "import prisma" server/routes/[presetCode]/[...text].get.ts` → no results
  - [ ] Has preset import: `grep "import.*getPresetByCode" server/routes/[presetCode]/[...text].get.ts` → found
  - [ ] Has content import: `grep "import.*getParsedText" server/routes/[presetCode]/[...text].get.ts` → found

  **Preset Loading**:
  - [ ] Uses getPresetByCode: `grep "await getPresetByCode" server/routes/[presetCode]/[...text].get.ts` → found
  - [ ] No Prisma calls: `grep "prisma\\." server/routes/[presetCode]/[...text].get.ts` → no results

  **Field Access**:
  - [ ] No templateInfo access: `grep "templateInfo" server/routes/[presetCode]/[...text].get.ts` → no results
  - [ ] Direct field access: `grep "preset\\.contentKeys" server/routes/[presetCode]/[...text].get.ts` → found

  **Manual API Test**:
  - [ ] Request: `curl -I http://localhost:4573/001/Hello+World` (after starting dev server)
  - [ ] Response status: 200
  - [ ] Response header: `Content-Type: image/png`
  - [ ] Response header: `Cache-Control: public, max-age=3600, immutable`

  **Evidence Required**:
  - [ ] Git diff showing import changes and preset loading change
  - [ ] curl output showing 200 OK response

  **Commit**: NO (groups with other tasks)

---

- [ ] 5. Update server/routes/[presetCode]/default.get.ts to use local generator

  **What to do**:
  - Remove lines 1-15 (entire proxy implementation)
  - Rewrite file to match pattern from `[...text].get.ts` but for default content
  - Import: `getPresetByCode`, `generateImage`, `renderErrorSvg`
  - Fetch preset using `getPresetByCode(presetCode!)`
  - Call `generateImage()` with preset and NO custom props (use all defaults)
  - Return image with same headers as `[...text].get.ts` (Content-Type, Cache-Control, ETag)

  **Must NOT do**:
  - Don't copy query parameter parsing logic (no customization on default endpoint)
  - Don't add download functionality (default endpoint is for direct viewing)
  - Don't change the route path or filename

  **Parallelizable**: NO (depends on Task 4)

  **References**:

  **Pattern Reference**:
  - `server/routes/[presetCode]/[...text].get.ts:6-94` - Full handler structure to follow
  - Lines 26-47: Preset loading and error handling pattern
  - Lines 68-91: Image generation and response headers pattern

  **Simplified Logic**:
  - No text parameter parsing (use preset defaults only)
  - No customContentProps (empty object)
  - No customStyleProps (empty object)
  - Support format query param: `?format=svg`

  **Implementation Template**:
  ```typescript
  import { getPresetByCode } from '~/server/utils/preset'
  import { generateImage } from '~/server/utils/image'
  import { renderErrorSvg } from '~/server/utils/satori'
  import { z } from 'zod'

  export default defineEventHandler(async (event) => {
    const presetCode = getRouterParam(event, 'presetCode')
    const query = await useSafeValidatedQuery(event, z.object({ format: z.enum(['svg', 'png']).optional() }))
    const format = query.data?.format || 'png'
    
    const preset = await getPresetByCode(presetCode!)
    
    if (!preset) {
      setHeader(event, 'Content-Type', 'image/svg+xml')
      setHeader(event, 'Cache-Control', 'public, max-age=3600, immutable')
      const svg = await renderErrorSvg('Preset not found', { width: 300, height: 100 })
      return svg
    }
    
    const image = await generateImage({ preset, format })
    
    setHeader(event, 'Content-Type', format === 'svg' ? 'image/svg+xml' : 'image/png')
    setHeader(event, 'Cache-Control', 'public, max-age=3600, immutable')
    
    const etag = `"${preset.code}-default"`
    setHeader(event, 'ETag', etag)
    
    const ifNoneMatch = getRequestHeader(event, 'if-none-match')
    if (ifNoneMatch === etag) {
      event.node.res.statusCode = 304
      return null
    }
    
    return image
  })
  ```

  **Acceptance Criteria**:

  **File Rewrite**:
  - [ ] No proxy imports: `grep "proxyRequest\\|joinURL" server/routes/[presetCode]/default.get.ts` → no results
  - [ ] Has correct imports: `grep "getPresetByCode\\|generateImage" server/routes/[presetCode]/default.get.ts` → found

  **Generates Locally**:
  - [ ] Uses generateImage: `grep "await generateImage" server/routes/[presetCode]/default.get.ts` → found
  - [ ] No proxyRequest call: `grep "proxyRequest" server/routes/[presetCode]/default.get.ts` → no results

  **Manual API Test**:
  - [ ] Request: `curl -I http://localhost:4573/001/default`
  - [ ] Response status: 200
  - [ ] Response header: `Content-Type: image/png`
  - [ ] Request: `curl -I http://localhost:4573/001/default?format=svg`
  - [ ] Response header: `Content-Type: image/svg+xml`

  **Evidence Required**:
  - [ ] Git diff showing complete file rewrite
  - [ ] curl output showing both PNG and SVG format work

  **Commit**: NO (groups with other tasks)

---

- [ ] 6. Remove proxy configuration from nuxt.config.ts

  **What to do**:
  - Edit `nuxt.config.ts`
  - Remove lines 67-71 (routeRules object with proxy config)
  - Keep all other nitro configuration (rollupConfig, imports)
  - Verify file syntax is still valid (no trailing commas, brackets)

  **Must NOT do**:
  - Don't remove Prisma alias configuration (lines 16-42) - not ready to remove yet
  - Don't remove other nitro config (rollupConfig, imports)
  - Don't modify runtimeConfig section

  **Parallelizable**: YES (independent of other tasks)

  **References**:

  **Lines to Remove** (exact content):
  ```typescript
  routeRules: {
    '/api/v1/**': {
      proxy: 'http://localhost:5777/api/v1/**'
    }
  },
  ```

  **Surrounding Context** (lines 60-84):
  - Line 60: `nitro: {`
  - Line 61-66: `rollupConfig: { ... }`
  - Line 67-71: **REMOVE THIS** routeRules
  - Line 72-83: `imports: { ... }` **KEEP THIS**
  - Line 84: `}` closing nitro

  **After Removal**:
  ```typescript
  nitro: {
    rollupConfig: {
      //@ts-ignore
      plugins: [
        vue()
      ]
    },
    imports: {
      presets: [
        // ... rest unchanged
      ]
    },
  }
  ```

  **Acceptance Criteria**:

  **Config Change**:
  - [ ] No routeRules: `grep "routeRules" nuxt.config.ts` → no results
  - [ ] No proxy config: `grep "proxy.*5777" nuxt.config.ts` → no results

  **File Valid**:
  - [ ] TypeScript valid: `pnpm nuxt typecheck` → no syntax errors
  - [ ] File structure: Still has nitro.rollupConfig and nitro.imports sections

  **Server Behavior**:
  - [ ] Request to old proxy route fails: `curl -I http://localhost:4573/api/v1/anything` → 404 Not Found (expected)

  **Evidence Required**:
  - [ ] Git diff showing routeRules removal
  - [ ] curl output showing /api/v1/** is no longer proxied

  **Commit**: NO (groups with other tasks)

---

- [ ] 7. Test all endpoints and verify self-contained functionality

  **What to do**:
  - Start dev server with `pnpm dev`
  - Verify server starts without database connection errors
  - Test preset 001 with custom text
  - Test preset 001 with default content
  - Test preset 002 with default content
  - Test non-existent preset (should return error SVG)
  - Test SVG format endpoint
  - Test ETag caching behavior
  - Verify no connection attempts to localhost:5777

  **Must NOT do**:
  - Don't test with database-dependent preset codes that don't have JSON files
  - Don't test frontend pages (this is API-only testing)
  - Don't test preset creation/update (read-only system)

  **Parallelizable**: NO (depends on Tasks 1-6)

  **References**:

  **Success Criteria**:
  - Server starts without "Prisma" or "database" errors in console
  - All test endpoints return 200 OK with correct Content-Type
  - Error endpoints return valid error SVG
  - No network connections to port 5777 (check with `netstat` or console logs)

  **Test Commands**:
  ```bash
  # Start server (in one terminal)
  pnpm dev

  # In another terminal, run these tests:

  # Test 1: Custom text with preset 001
  curl -I http://localhost:4573/001/Hello+IMGX
  curl http://localhost:4573/001/Hello+IMGX -o test-001-custom.png

  # Test 2: Default content preset 001
  curl -I http://localhost:4573/001/default
  curl http://localhost:4573/001/default -o test-001-default.png

  # Test 3: Default content preset 002
  curl -I http://localhost:4573/002/default
  curl http://localhost:4573/002/default -o test-002-default.png

  # Test 4: Non-existent preset (should return error SVG)
  curl -I http://localhost:4573/999/test
  curl http://localhost:4573/999/test -o test-error.svg

  # Test 5: SVG format
  curl -I "http://localhost:4573/001/test?format=svg"
  curl "http://localhost:4573/001/test?format=svg" -o test-svg.svg

  # Test 6: ETag caching
  ETAG=$(curl -I http://localhost:4573/001/default 2>&1 | grep -i etag | cut -d' ' -f2)
  curl -I -H "If-None-Match: $ETAG" http://localhost:4573/001/default
  # Should return 304 Not Modified

  # Test 7: Verify no proxy attempts
  curl -I http://localhost:4573/api/v1/anything
  # Should return 404 (not proxied)
  ```

  **Acceptance Criteria**:

  **Server Startup**:
  - [ ] Command: `pnpm dev`
  - [ ] Server starts successfully on port 4573
  - [ ] No errors containing "Prisma", "database", or "connection" in console
  - [ ] Logs show: "Nuxt 4" and "Local: http://localhost:4573"

  **Test 1 - Custom Text**:
  - [ ] Status: 200 OK
  - [ ] Header: `Content-Type: image/png`
  - [ ] File saved: test-001-custom.png exists and is valid PNG

  **Test 2 - Default 001**:
  - [ ] Status: 200 OK
  - [ ] Header: `Content-Type: image/png`
  - [ ] File saved: test-001-default.png exists

  **Test 3 - Default 002**:
  - [ ] Status: 200 OK
  - [ ] Header: `Content-Type: image/png`
  - [ ] File saved: test-002-default.png exists (visually different from 001)

  **Test 4 - Error Handling**:
  - [ ] Status: 200 OK (error SVG still returns 200)
  - [ ] Header: `Content-Type: image/svg+xml`
  - [ ] File contains: "Preset not found" text in SVG

  **Test 5 - SVG Format**:
  - [ ] Status: 200 OK
  - [ ] Header: `Content-Type: image/svg+xml`
  - [ ] File saved: test-svg.svg is valid SVG (starts with `<svg`)

  **Test 6 - ETag Caching**:
  - [ ] First request: 200 OK with ETag header
  - [ ] Second request with If-None-Match: 304 Not Modified
  - [ ] No response body on 304

  **Test 7 - No Proxy**:
  - [ ] Status: 404 Not Found
  - [ ] No attempts to connect to localhost:5777 (check server console)

  **Evidence Required**:
  - [ ] Screenshot or text of server startup logs (no errors)
  - [ ] Terminal output from all curl commands showing status codes
  - [ ] List of generated test files: `ls test-*.png test-*.svg`

  **Commit**: NO (testing only)

---

- [ ] 8. Commit all changes with descriptive message

  **What to do**:
  - Stage all modified files: presets/, server/utils/, server/routes/, nuxt.config.ts
  - Create commit with message: `feat: implement file-based preset system, remove database dependency`
  - Verify commit includes all intended changes
  - Push to remote repository

  **Must NOT do**:
  - Don't commit test output files (test-*.png, test-*.svg)
  - Don't commit node_modules or .nuxt directory
  - Don't commit .env file
  - Don't include unrelated changes

  **Parallelizable**: NO (depends on Task 7)

  **References**:

  **Commit Message Format**:
  - Following Angular convention: `type(scope): subject`
  - Type: `feat` (new feature)
  - Subject: Clear description of what changed

  **Files to Stage**:
  - `presets/001.json` (NEW)
  - `presets/002.json` (NEW)
  - `server/utils/preset.ts` (NEW)
  - `server/utils/image.ts` (MODIFIED)
  - `server/routes/[presetCode]/[...text].get.ts` (MODIFIED)
  - `server/routes/[presetCode]/default.get.ts` (MODIFIED)
  - `nuxt.config.ts` (MODIFIED)

  **Acceptance Criteria**:

  **Git Status Clean**:
  - [ ] Command: `git status`
  - [ ] Shows only intended files in "Changes to be committed"
  - [ ] No test output files staged

  **Commit Created**:
  - [ ] Command: `git add presets/ server/utils/preset.ts server/utils/image.ts server/routes/ nuxt.config.ts`
  - [ ] Command: `git commit -m "feat: implement file-based preset system, remove database dependency"`
  - [ ] Commit successful with message showing files changed

  **Commit Content Verification**:
  - [ ] Command: `git show --stat`
  - [ ] Shows 7 files changed (2 new, 5 modified)
  - [ ] Additions: ~200-300 lines
  - [ ] Deletions: ~50-100 lines

  **Push to Remote**:
  - [ ] Command: `git push`
  - [ ] Push successful
  - [ ] Verify on remote repository (GitHub/Gitea)

  **Evidence Required**:
  - [ ] Terminal output from `git log -1 --stat` showing commit details
  - [ ] Git diff summary showing key changes

  **Commit**: YES
  - Message: `feat: implement file-based preset system, remove database dependency`
  - Files: `presets/*.json, server/utils/preset.ts, server/utils/image.ts, server/routes/[presetCode]/*.ts, nuxt.config.ts`
  - Pre-commit: Run `pnpm typecheck` to ensure no TypeScript errors

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 8 | `feat: implement file-based preset system, remove database dependency` | presets/, server/utils/preset.ts, server/utils/image.ts, server/routes/, nuxt.config.ts | pnpm dev starts successfully, curl tests pass |

---

## Success Criteria

### Verification Commands
```bash
# Server starts without database
pnpm dev  # Expected: No Prisma errors, starts on port 4573

# API endpoints work
curl http://localhost:4573/001/Hello  # Expected: PNG image
curl http://localhost:4573/001/default  # Expected: PNG image
curl http://localhost:4573/002/default  # Expected: PNG image with gradient

# Proxy removed
curl http://localhost:4573/api/v1/test  # Expected: 404 Not Found

# SVG format works
curl "http://localhost:4573/001/test?format=svg"  # Expected: SVG image
```

### Final Checklist
- [ ] All "Must Have" features present (file-based loading, caching, error handling, template extraction)
- [ ] All "Must NOT Have" guardrails respected (no Prisma deletion, no icon.ts removal, no frontend changes)
- [ ] All tests pass (7 curl tests in Task 7)
- [ ] Server starts without external dependencies
- [ ] Code follows project conventions (TypeScript, ESM, Nuxt patterns)
- [ ] Commit message follows Angular convention
