# AGENTS.md - Guide for Coding Agents

Essential information for AI coding agents working on the IMGX project.

## ⚠️ CRITICAL RULES

### DO NOT Start Dev Server

**NEVER** start, restart, or manage the dev server (`pnpm dev`) automatically:
- ❌ Do NOT run `pnpm dev`
- ❌ Do NOT run `pkill` then restart server
- ❌ Do NOT attempt to "fix" server issues by restarting
- ✅ If testing is needed, **ASK the user first**
- ✅ Assume the server is already running when needed
- ✅ If server issues occur, report to user and wait for instructions

**Reason:** Server management should be controlled by the user to avoid disrupting their workflow.

## Project Overview

IMGX is a Nuxt 4 app that generates card images from text via API. Core stack: Vue 3, TypeScript, Tailwind CSS, Prisma, and Satori (HTML/CSS → SVG → PNG).

## Commands

### Development
```bash
pnpm dev              # Dev server on port 4573 with auto-open
pnpm build            # Production build
pnpm preview          # Preview production build
```

### Release
```bash
pnpm release          # Patch bump + changelog + push
pnpm release:minor    # Minor bump
pnpm release:major    # Major bump
```

### Testing
**No automated test suite.** Manual testing via `pnpm dev`. If adding tests, consider Vitest + @vue/test-utils.

### Package Manager
**Use pnpm exclusively** (v9.15.4). Do not use npm or yarn.

## Code Style

### Linting & Formatting
- No ESLint or Prettier config. Follow patterns in existing code.
- TypeScript strict mode via Nuxt's tsconfig.

### TypeScript

**Type Definitions:**
```typescript
// Prefer 'type' for shapes, 'interface' for extendable contracts
type TextPart = { text: string; accent: boolean }
interface ComponentBaseProps { content: ParsedContent }

// Always use type-only imports when importing types
import type { Component } from 'vue'
import type { HTMLAttributes } from 'vue'
```

**Zod Schemas for Validation:**
```typescript
// Use Zod for runtime validation + type inference
const schema = z.object({
  format: z.enum(['svg', 'png']).optional().default('png'),
  colors: z.string().optional(),  // Normalize later
}).catchall(z.any())  // Allow extra props for flexibility

// In event handlers
const query = await useSafeValidatedQuery(event, schema)
if (!query.success) {
  throw createError({ statusCode: 400, statusMessage: query.message })
}
```

### Import Order
1. External libs (vue, @resvg/resvg-js, zod)
2. Type imports (`import type { ... }`)
3. Nuxt aliases (`~/lib/*`, `~/server/utils/*`)
4. Assets (fonts as buffers: `import Font from '~/assets/fonts/Font.ttf'`)

### Vue Components

```vue
<script setup lang="ts">
// 1. Imports
import type { HTMLAttributes } from 'vue'
import { computed, watch } from 'vue'

// 2. Type definitions
interface Props {
  modelValue: string
  placeholder?: string
}

// 3. Props & emits
const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Enter text'
})
const emit = defineEmits<{ 'update:modelValue': [string] }>()

// 4. State & composables
const localValue = ref(props.modelValue)

// 5. Computed & methods
const formattedValue = computed(() => localValue.value.trim())
</script>
```

**Conventions:**
- Always `<script setup lang="ts">`
- PascalCase filenames: `SchemaEditor.vue`, `TextHighlight.vue`
- Use `cn()` helper for class merging (from `~/lib/utils`)

### Server/API Routes

**File Naming:**
- Dynamic routes: `[presetCode]/[...text].get.ts`
- Middleware: Numeric prefix for order: `1.auth0.ts`, `2.rateLimit.ts`

**Event Handler Pattern:**
```typescript
export default defineEventHandler(async (event) => {
  // 1. Extract params
  const code = getRouterParam(event, 'code')
  
  // 2. Validate with Zod
  const query = await useSafeValidatedQuery(event, schema)
  if (!query.success) {
    throw createError({ statusCode: 400, statusMessage: query.message })
  }
  
  // 3. Process & return
  const result = await processData(query.data)
  
  // 4. Set headers (caching)
  setHeader(event, 'Cache-Control', 'public, max-age=3600, immutable')
  const etag = `"${hashContent(result)}"`
  setHeader(event, 'ETag', etag)
  
  // 5. Check client cache (304)
  if (getRequestHeader(event, 'if-none-match') === etag) {
    event.node.res.statusCode = 304
    return null
  }
  
  return result
})
```

**Middleware Patterns:**
- **Auth:** JWT from cookies via `jose.jwtVerify()`, set `event.context.userId`
- **Rate Limit:** Redis via `useStorage('redis')`, key: `ratelimit:${ip}:${path}`

**Parameter Normalization:**
```typescript
// Arrays: fontSizes, colors, iconSizes
// Query: ?colors[]=FF0000&colors[]=00FF00 or ?colors=FF0000,00FF00
// Both normalize to: { colors: ['#FF0000', '#00FF00'] }

import { normalizeStyleProps } from '~/server/utils/paramNormalizer'
const normalized = normalizeStyleProps(rawProps, propsSchema)
```

### Error Handling

```typescript
// Server: Use createError
throw createError({
  statusCode: 400,
  statusMessage: '参数错误'  // Mixed CN/EN is OK
})

// Async ops: try-catch + console.error
try {
  const result = await riskyOperation()
} catch (error) {
  console.error('[Route] Error:', error)
  throw createError({ statusCode: 500, statusMessage: 'Generation failed' })
}
```

### Naming Conventions

| Type | Convention | Examples |
|------|------------|----------|
| Variables/Functions | camelCase | `generateImage`, `isLoading`, `baseUrl` |
| Booleans | is/has/should prefix | `isValid`, `hasAccess` |
| Event handlers | handle/on prefix | `handleClick`, `onSubmit` |
| Components | PascalCase | `SchemaEditor.vue`, `GlowBorder.vue` |
| Constants | UPPER_SNAKE_CASE | `COLOR_RANGES`, `MAX_SIZE` |
| Config objects | camelCase | `runtimeConfig`, `colorMap` |

## Key Patterns

### Image Generation Flow
1. Route extracts preset code + dynamic content from URL path
2. Validate query params with Zod
3. Split props: `contentKeys` → content, rest → style
4. Normalize style props (add `#` to colors, `px` to sizes)
5. Merge with preset defaults
6. Render Vue component → Satori → SVG → Resvg → PNG
7. Return with ETag + Cache-Control headers

### Content Parsing
- Asterisk `*text*` marks accent text: `"Hello*World*"` → "Hello", "World" (accented)
- Square brackets `[icon]` for emoji/icons: `"[twemoji:fire]"`
- Path segments map to `preset.contentKeys`: `/api/102/icon1/icon2/text`

### Caching Strategy
- **ETag:** Hash of query params, check `if-none-match` → 304
- **Cache-Control:** `public, max-age=3600, immutable`
- **Redis:** Rate limiting + preset caching

## Common Pitfalls

1. **Fonts:** Must import as buffers for Satori: `import Font from '~/assets/fonts/Font.ttf'`
2. **Prisma:** Custom alias `@prisma/client/index-browser` for browser compatibility
3. **Auto-imports:** Nuxt auto-imports utils/composables—don't re-import
4. **Type suppression:** Never use `as any`, `@ts-ignore`, `@ts-expect-error`
5. **Zod catchall:** Use `.catchall(z.any())` for flexibility with unknown props

## File Structure

```
server/
  routes/[presetCode]/[...text].get.ts  # Main image generation endpoint
  middleware/1.auth0.ts                 # JWT validation
  middleware/2.rateLimit.ts             # Redis rate limiting
  utils/satori.ts                       # Satori rendering + fonts
  utils/paramNormalizer.ts              # Style prop normalization
lib/
  schema.ts                             # Zod schemas
  content.ts                            # Text parsing (accent marks)
  utils.ts                              # cn() helper
components/
  ui/                                   # shadcn-vue components
  preset/                               # Preset editor
```

## Dependencies

- **Nuxt 4:** Meta-framework (v4.3.0)
- **Satori:** HTML/CSS → SVG rendering
- **Resvg:** SVG → PNG conversion
- **Zod + h3-zod:** Runtime validation
- **Prisma:** Database ORM
- **shadcn-vue:** UI components
- **Tailwind CSS:** Utility-first styling

## Notes

- ES modules only (`"type": "module"`)
- Dev server: `localhost:4573`
- Nuxt compatibility: `2025-02-08`
- Mixed CN/EN comments/messages accepted
