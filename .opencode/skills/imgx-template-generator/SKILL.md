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

## Standard reference template

The following template (`components/template/Base.vue`) is the **standard reference** for IMGX templates. It demonstrates all best practices and supports every feature:

```vue
<script setup lang="ts">
import type { componentBaseProps } from '~/lib/content'

// Props with comprehensive defaults
const {
  content = [],
  bgColor = '',
  
  colors = ['#000000'],
  accentColors = ['#0088a9'],
  aligns = ['justify-start'], // 横向对齐方式
  fontSizes = ['30px'],
  verticalAligns = ['center'],
  
  fontFamily = 'YouSheBiaoTiHei',
  padding = '30px',
  bgImage = 'linear-gradient(to right, transparent, transparent)',
  textWrapBgColor = 'transparent',
  textWrapShadow = 'none',
  textWrapPadding = '0px',
  textWrapRounded = 'none'
} = defineProps<componentBaseProps>()
</script>

<template>
  <!-- Root: w-full h-full flex -->
  <div class="w-full h-full flex items-center justify-center transition-all duration-300"
    :style="{ 
      backgroundColor: bgColor ?? 'transparent', 
      backgroundImage: bgImage ?? 'linear-gradient(to right, transparent, transparent)', 
      padding: padding, 
      fontFamily: fontFamily 
    }">
    
    <!-- Content wrapper (optional background/padding layer) -->
    <div :class="[`text-wrap flex w-full h-full rounded-${textWrapRounded} shadow-${textWrapShadow}`]"
      :style="{ 
        backgroundColor: textWrapBgColor, 
        padding: textWrapPadding, 
        justifyContent: verticalAligns[0] ?? 'center' 
      }">
      
      <!-- Line container -->
      <div class="flex flex-col w-full">
        <!-- Render each line from content -->
        <template v-for="(line, index) in content">
          <div :class="['font-bold flex', aligns[index]]" 
            :style="{ color: colors[index], fontSize: fontSizes[index] }">
            
            <!-- Render each text part -->
            <template v-for="(text, index) in line" :key="index">
              <!-- Emoji/Icon: Use background image -->
              <span class="flex" v-if="text.type === 'emoji'"
                :style="{ 
                  width: iconSizes && iconSizes[index] + 'px', 
                  height: iconSizes && iconSizes[index] + 'px', 
                  backgroundImage: `url(${text.base64URL})`, 
                  backgroundRepeat: 'no-repeat', 
                  backgroundSize: '100% 100%' 
                }"></span>
              
              <!-- Text or accent text -->
              <span class="text-nowrap" v-else
                :style="{ color: text.type === 'accent' ? (accentColors[index] || '') : '' }">
                {{ text.text }}
              </span>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
```

### Why this is the standard

- ✅ **Fully Satori-compliant**: Every div has explicit flex, no forbidden CSS
- ✅ **Supports all special syntax**: Handles `*accent*`, `[emoji]`, `+` separators
- ✅ **Props properly classified**: Clear distinction between content and style props
- ✅ **Multi-line rendering**: Supports variable number of content lines
- ✅ **Customizable alignment**: Per-line horizontal and vertical alignment
- ✅ **Optional content wrapper**: Adds background/padding layer when needed
- ✅ **Comprehensive defaults**: Every prop has a sensible fallback value
- ✅ **Type-safe**: Uses `componentBaseProps` interface

### Best practices from Base.vue

1. **Always use componentBaseProps type** for props definition
2. **Provide defaults for every prop** to avoid undefined errors
3. **Use arrays for per-line styling** (colors, fontSizes, aligns)
4. **Null-safe style bindings** with `??` operator
5. **Text wrapping in spans** - never raw text nodes
6. **Emoji as background images** in flex containers
7. **Conditional styling** via ternary operators in :style

## Design patterns

### Pattern 1: Simple title card

Centered title with gradient background - perfect for article covers and social sharing.

```vue
<template>
  <div class="w-full h-full flex items-center justify-center"
    :style="{ backgroundImage: `linear-gradient(135deg, ${bgColor[0]}, ${bgColor[1]})`, padding }">
    <div class="flex font-bold text-center" 
      :style="{ fontSize: titleSize + 'px', color: titleColor }">
      {{ title }}
    </div>
  </div>
</template>
```

**Props JSON**:
```json
{
  "bgColor": ["#1e40af", "#7c3aed"],
  "title": "Building Modern Web Applications",
  "titleColor": "#ffffff",
  "titleSize": 48,
  "padding": 60
}
```

**Classification**:
- Content props: `title`
- Style props: `bgColor`, `titleColor`, `titleSize`, `padding`
- Content keys: `"title"`

**Usage**: `GET /preset-code/Building+Modern+Web+Applications?bgColor=1e40af-7c3aed`

---

### Pattern 2: Icon + Title

Icon on left, title on right - great for branded content and project showcases.

```vue
<template>
  <div class="w-full h-full flex items-center justify-center"
    :style="{ backgroundImage: `linear-gradient(to right, ${bgColor[0]}, ${bgColor[1]})`, padding }">
    <div class="flex items-center gap-6">
      <!-- Icon container -->
      <div class="flex" :style="{ width: iconSize + 'px', height: iconSize + 'px' }">
        <img :src="iconUrl" class="w-full" alt="icon" />
      </div>
      
      <!-- Title -->
      <div class="flex font-bold" 
        :style="{ fontSize: titleSize + 'px', color: titleColor }">
        {{ title }}
      </div>
    </div>
  </div>
</template>
```

**Props JSON**:
```json
{
  "bgColor": ["#0f172a", "#1e293b"],
  "icon": "[logos:vue]",
  "iconSize": 120,
  "title": "Vue 3 Masterclass",
  "titleColor": "#ffffff",
  "titleSize": 56,
  "padding": 60
}
```

**Classification**:
- Content props: `icon`, `title`
- Style props: `bgColor`, `iconSize`, `titleColor`, `titleSize`, `padding`
- Content keys: `"icon,title"`

**Usage**: `GET /preset-code/[logos:vue]/Vue+3+Masterclass?iconSize=120`

---

### Pattern 3: Blog post cover

Multi-line vertical layout with title, subtitle, and author - ideal for blog articles.

```vue
<template>
  <div class="w-full h-full flex items-center justify-center"
    :style="{ backgroundImage: `linear-gradient(135deg, ${bgColor[0]}, ${bgColor[1]})`, padding }">
    <div class="flex flex-col w-full gap-8">
      <!-- Title -->
      <div class="flex justify-center font-bold text-center" 
        :style="{ fontSize: titleSize + 'px', color: titleColor }">
        {{ title }}
      </div>
      
      <!-- Subtitle -->
      <div class="flex justify-center text-center" 
        :style="{ fontSize: subtitleSize + 'px', color: subtitleColor }">
        {{ subtitle }}
      </div>
      
      <!-- Author -->
      <div class="flex justify-end" 
        :style="{ fontSize: authorSize + 'px', color: authorColor }">
        by {{ author }}
      </div>
    </div>
  </div>
</template>
```

**Props JSON**:
```json
{
  "bgColor": ["#1e40af", "#7c3aed"],
  "title": "Deep Dive into Vue 3 Composition API",
  "subtitle": "Best practices and patterns for modern Vue development",
  "author": "@frontend-guru",
  "titleColor": "#ffffff",
  "subtitleColor": "#e5e7eb",
  "authorColor": "#d1d5db",
  "titleSize": 48,
  "subtitleSize": 28,
  "authorSize": 20,
  "padding": 60
}
```

**Classification**:
- Content props: `title`, `subtitle`, `author`
- Style props: `bgColor`, `titleColor`, `subtitleColor`, `authorColor`, `titleSize`, `subtitleSize`, `authorSize`, `padding`
- Content keys: `"title,subtitle,author"`

**Usage**: `GET /preset-code/Deep+Dive+into+Vue+3/Best+practices/@frontend-guru`

---

### Pattern 4: Social share card

Compact layout with icon and accent text - optimized for Twitter/LinkedIn sharing.

```vue
<template>
  <div class="w-full h-full flex items-center justify-center"
    :style="{ backgroundColor: bgColor, padding }">
    <div class="flex flex-col items-center gap-6">
      <!-- Icon -->
      <div class="flex" :style="{ width: iconSize + 'px', height: iconSize + 'px' }">
        <img :src="iconUrl" class="w-full" alt="icon" />
      </div>
      
      <!-- Title with accent -->
      <div class="flex text-center font-bold" 
        :style="{ fontSize: titleSize + 'px', color: titleColor }">
        <span>{{ titlePart1 }}</span>
        <span :style="{ color: accentColor }">{{ accentText }}</span>
        <span>{{ titlePart2 }}</span>
      </div>
    </div>
  </div>
</template>
```

**Props JSON**:
```json
{
  "bgColor": "#ffffff",
  "icon": "[twemoji:rocket]",
  "iconSize": 80,
  "title": "Launch Your *Next Project* Today",
  "titleColor": "#1f2937",
  "accentColor": "#ef4444",
  "titleSize": 36,
  "padding": 40
}
```

**Classification**:
- Content props: `icon`, `title`
- Style props: `bgColor`, `iconSize`, `titleColor`, `accentColor`, `titleSize`, `padding`
- Content keys: `"icon,title"`

**Note**: The `*Next Project*` syntax auto-parses into accent styling.

---

## Output format

When generating templates, provide:

### 1. Template code
```vue
<template>
  <!-- Complete Vue template following all constraints -->
</template>
```

### 2. Props JSON
```json
{
  "prop1": "value1",
  "prop2": 42
}
```

### 3. Usage example
```
GET https://imgx.zzao.club/{presetCode}/{title}/{subtitle}?bgColor=fff&titleSize=60
```

### 4. Prop classification guide
```
Content props (URL path): title, subtitle, author
Style props (query params): bgColor, titleSize, padding
Content keys order: "title,subtitle,author"
```
