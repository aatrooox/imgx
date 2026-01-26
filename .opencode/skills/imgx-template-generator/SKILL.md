---
name: imgx-template-generator
description: Generate IMGX-compatible Vue templates that convert text to beautiful card images with Satori
license: MIT
compatibility: opencode
metadata:
  audience: template-creators
  workflow: imgx-development
---

# IMGX Template Generator

Generate Vue templates that convert text into card images using Satori rendering engine.

## What I do

- Generate Vue 3 `<template>` code following strict Satori/IMGX constraints
- Create corresponding `props` JSON with proper type classification
- Provide ready-to-use code for IMGX Playground
- Suggest semantic prop names and default values
- Support special syntax: `*accent*`, `[emoji]`, `+` line separators
- Ensure all code meets Satori rendering requirements
- Guide you through the complete template creation workflow

## When to use me

Use this skill when you need to:
- Create a new IMGX template from scratch
- Convert a design description into IMGX-compatible code
- Adapt an existing design or mockup to IMGX format
- Generate templates for common use cases (covers, social cards, badges)
- Understand Satori constraints and best practices for template creation
## Critical constraints

### Satori rendering rules (MANDATORY)

```
✅ MUST:
- Every <div> explicitly declares display: flex
- Root element is class="w-full h-full"
- Use only Tailwind utility classes + inline :style
- All text inside <span> or <div>, never raw text nodes
- All layouts via Flexbox (flex-row, flex-col, items-*, justify-*)

❌ NEVER:
- CSS properties: box-shadow, transform, filter, backdrop-filter
- CSS animations or transitions
- External images (use base64 DataURL only)
- Nested components or slots
- v-if/v-show (use template v-for instead)
- Complex selectors or pseudo-elements
```

### Template structure

```vue
<script setup lang="ts">
import type { componentBaseProps } from '~/lib/content'

// Define props with componentBaseProps type
const {
  content = [],
  bgColor = '',
  bgImage = 'linear-gradient(to right, transparent, transparent)',
  
  colors = ['#000000'],
  accentColors = ['#0088a9'],
  fontSizes = ['30px'],
  aligns = ['justify-start'],
  iconSizes = [30],
  
  fontFamily = 'YouSheBiaoTiHei',
  padding = '30px',
  textWrapBgColor = 'transparent',
  textWrapPadding = '0px',
  textWrapRounded = 'none',
  textWrapShadow = 'none'
} = defineProps<componentBaseProps>()
</script>

<template>
  <!-- Root: w-full h-full flex -->
  <div class="w-full h-full flex items-center justify-center"
    :style="{ backgroundColor: bgColor, backgroundImage: bgImage, padding, fontFamily }">
    
    <!-- Content wrapper (optional) -->
    <div class="flex w-full h-full"
      :style="{ backgroundColor: textWrapBgColor, padding: textWrapPadding }">
      
      <!-- Line-by-line rendering -->
      <div class="flex flex-col w-full">
        <template v-for="(line, lineIdx) in content" :key="lineIdx">
          <div :class="['flex', aligns[lineIdx]]" 
            :style="{ color: colors[lineIdx], fontSize: fontSizes[lineIdx] }">
            
            <!-- Text parts: normal | accent | emoji -->
            <template v-for="(part, partIdx) in line" :key="partIdx">
              <!-- Emoji: background image in flex div -->
              <span v-if="part.type === 'emoji'" class="flex"
                :style="{ 
                  width: iconSizes[lineIdx] + 'px', 
                  height: iconSizes[lineIdx] + 'px',
                  backgroundImage: `url(${part.base64URL})`,
                  backgroundSize: '100% 100%'
                }"></span>
              
              <!-- Text or accent text -->
              <span v-else class="text-nowrap"
                :style="{ color: part.type === 'accent' ? accentColors[lineIdx] : '' }">
                {{ part.text }}
              </span>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
```

### Props JSON structure

```json
{
  "bgColor": ["#ffffff", "#000000"],
  "title": "Main heading text",
  "subtitle": "Secondary text",
  "titleFontSize": 48,
  "subtitleFontSize": 24,
  "textColor": "#000000",
  "accentColor": "#ff0000",
  "padding": 40,
  "icon": "[logos:vuejs]"
}
```

#### Prop type classification

**Content props** (text data, mapped from URL path):
- String values like `title`, `subtitle`, `author`, `description`
- Arrays like `lines` (if using comma separator)

**Style props** (visual config, passed via query params):
- Colors: `bgColor`, `textColor`, `accentColor` (hex with/without #)
- Sizes: `titleFontSize`, `iconWidth`, `padding` (numbers in px)
- Layout: `align` (0=left, 1=center, 2=justify, 3=around)

### Special syntax support

When users input text via API, these patterns are auto-parsed:

| Syntax | Type | Example | Usage in template |
|--------|------|---------|------------------|
| `*text*` | accent | `Hello *world*` | `part.type === 'accent'` |
| `[icon]` | emoji | `[logos:vuejs] Vue` | `part.type === 'emoji'`, `part.base64URL` |
| `+` | separator | `Title+Subtitle` | Splits into `content[0]`, `content[1]` |

**Icons**: Use Iconify notation like `[logos:vuejs]`, `[mdi:github]`, `[twemoji:fire]`

### Available fonts

Only these fonts are preloaded:
- `YouSheBiaoTiHei` (优设标体黑) - default, bold display
- `DouyinSansBold` (抖音美好体) - rounded, friendly

## Quality checklist

Before delivering template code, verify:

- [ ] Root element is `class="w-full h-full"`
- [ ] Every `<div>` has explicit `flex` class
- [ ] No forbidden CSS (box-shadow, transform, filter)
- [ ] All text wrapped in `<span>` or `<div>`
- [ ] Colors use hex format (with/without #)
- [ ] Sizes use `px` unit in inline styles
- [ ] Props follow `componentBaseProps` type
- [ ] Content props are strings/arrays
- [ ] Style props are colors/numbers
- [ ] Default values are reasonable
- [ ] Layout works at different sizes (test 1200x630, 1000x500, 800x418)

## Common pitfalls to avoid

1. ❌ Forgetting `flex` on every `<div>`
2. ❌ Using `v-if` instead of `v-for` with guards
3. ❌ External image URLs (Satori can't fetch them)
4. ❌ Inconsistent prop types (string vs number)
5. ❌ Missing default values in destructuring
6. ❌ Poor contrast (dark text on dark bg)
7. ❌ Over-engineering (too many customization props)
