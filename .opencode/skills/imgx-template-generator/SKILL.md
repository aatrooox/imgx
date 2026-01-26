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

## Workflow

When generating an IMGX template, follow these 4 phases:

### 1. Gather requirements

Ask the user these questions:

**Purpose**
- What's the primary use case? (blog cover, social share card, badge, quote card, etc.)
- What platform is this for? (Twitter/X, WeChat, general web, etc.)

**Content structure**
- How many text fields do you need? (single title, title + subtitle, title + subtitle + author, etc.)
- Do you need emoji/icon support?
- Do you need multi-line text with separators (`+`)?
- Do you need accent text (`*emphasized*`)?

**Visual style**
- What's the visual style? (minimal, bold, gradient, with icons, geometric, etc.)
- Do you have a color scheme preference? (fixed colors or user-customizable?)
- Do you have a reference design or inspiration?

**Layout preferences**
- Alignment preference? (center, left, right, mixed)
- Single-column or multi-section layout?
- Background style? (solid, gradient, pattern, image)

### 2. Design layout

Based on requirements, choose a layout strategy:

**For simple single-focus cards** (quotes, badges, announcements)
- Center-aligned layout with `items-center justify-center`
- Large font size (text-6xl or larger)
- Minimal content wrapper padding
- Use gradient or solid background

**For structured content cards** (blog covers, social shares)
- Vertical flex layout with `flex-col justify-between`
- Multiple sections (header, main content, footer)
- Consistent padding and spacing
- Use semantic alignment (title left, author bottom-left)

**For icon-based cards** (feature highlights, stats)
- Horizontal layout with `flex-row items-center`
- Icon/emoji on left, text on right
- Use `gap-*` utilities for spacing
- Balance icon size with text size

**For multi-line text cards** (lists, agendas)
- Vertical flex with `flex-col` on content wrapper
- Use `v-for` to iterate over `content` array
- Consistent line spacing with `gap-*`
- Consider alternate styling for variety

### 3. Generate code

Follow this step-by-step process:

**Step 1: Define props interface**
```vue
<script setup lang="ts">
interface Props {
  // Content props (from URL path)
  title: string
  subtitle?: string
  author?: string
  
  // Style props (from query params)
  bgColor?: string
  titleColor?: string
  fontSize?: string
  padding?: string
}

const props = withDefaults(defineProps<Props>(), {
  // Provide sensible defaults
  bgColor: '#1a1a1a',
  titleColor: '#ffffff',
  fontSize: '64px',
  padding: '80px'
})
</script>
```

**Step 2: Build root container**
```vue
<template>
  <div class="w-full h-full flex items-center justify-center">
    <!-- Always start with w-full h-full flex -->
  </div>
</template>
```

**Step 3: Add background/content wrapper**
```vue
<div 
  class="w-full h-full flex items-center justify-center"
  :style="{ background: props.bgColor }"
>
  <div 
    class="flex flex-col gap-4"
    :style="{ padding: props.padding }"
  >
    <!-- Content goes here -->
  </div>
</div>
```

**Step 4: Render content fields**

For simple text:
```vue
<div 
  class="text-6xl font-bold text-center"
  :style="{ color: props.titleColor, fontSize: props.fontSize }"
>
  {{ props.title }}
</div>
```

For parsed content (with accent/emoji support):
```vue
<div class="text-6xl font-bold">
  <template v-for="(part, i) in parsedTitle" :key="i">
    <span v-if="part.type === 'normal'">{{ part.text }}</span>
    <span v-else-if="part.type === 'accent'" class="text-blue-400">
      {{ part.text }}
    </span>
    <img 
      v-else-if="part.type === 'emoji'" 
      :src="part.base64URL" 
      class="inline-block"
      style="width: 1em; height: 1em;"
    />
  </template>
</div>
```

**Step 5: Add helper functions if needed**
```vue
<script setup lang="ts">
import { parseContent } from '~/lib/content'

// ... props definition ...

const parsedTitle = computed(() => parseContent(props.title))
</script>
```

### 4. Provide usage

After generating the template code, provide:

**1. Complete Vue component code**
```vue
<script setup lang="ts">
// ... full code ...
</script>

<template>
  <!-- ... full template ... -->
</template>
```

**2. Props JSON with categories**
```json
{
  "contentProps": {
    "title": {
      "type": "string",
      "default": "Hello World",
      "description": "Main title text"
    }
  },
  "styleProps": {
    "bgColor": {
      "type": "string", 
      "default": "#1a1a1a",
      "description": "Background color"
    }
  }
}
```

**3. GET API examples**
```
Basic usage:
GET /api/img/1200x630/YourTemplate/Hello+World

With style params:
GET /api/img/1200x630/YourTemplate/Hello+World?bgColor=ff6b6b&titleColor=ffffff

With multi-field content (if applicable):
GET /api/img/1200x630/YourTemplate/Hello+World/Subtitle+Text/Author+Name
```

**4. Testing instructions**
```
1. Copy the template code
2. Go to http://localhost:4573/playground
3. Paste code in left editor
4. Paste props JSON in right editor
5. Adjust props and see live preview
6. Export when satisfied
```

## Examples

### Example 1: Minimalist quote card

**Scenario**: User wants a simple centered quote card with gradient background for social media sharing.

**Requirements gathered**:
- Purpose: Share inspirational quotes on Twitter
- Content: Single text field (the quote)
- Style: Minimal, centered, gradient background
- Support for emphasis text (`*word*`)

**Generated template**:

```vue
<script setup lang="ts">
import { parseContent } from '~/lib/content'

interface Props {
  quote: string
  bgFrom?: string
  bgTo?: string
  textColor?: string
  fontSize?: string
}

const props = withDefaults(defineProps<Props>(), {
  bgFrom: '#667eea',
  bgTo: '#764ba2',
  textColor: '#ffffff',
  fontSize: '72px'
})

const parsed = computed(() => parseContent(props.quote))
</script>

<template>
  <div 
    class="w-full h-full flex items-center justify-center"
    :style="{ 
      background: `linear-gradient(135deg, ${props.bgFrom}, ${props.bgTo})` 
    }"
  >
    <div 
      class="flex flex-col items-center text-center px-20"
      :style="{ maxWidth: '900px' }"
    >
      <div 
        class="font-bold leading-tight"
        :style="{ color: props.textColor, fontSize: props.fontSize }"
      >
        <template v-for="(part, i) in parsed" :key="i">
          <span v-if="part.type === 'normal'">{{ part.text }}</span>
          <span 
            v-else-if="part.type === 'accent'" 
            :style="{ color: props.bgFrom, background: props.textColor, padding: '0 8px' }"
          >
            {{ part.text }}
          </span>
        </template>
      </div>
    </div>
  </div>
</template>
```

**Props JSON**:
```json
{
  "contentProps": {
    "quote": {
      "type": "string",
      "default": "The only way to do *great work* is to love what you do",
      "description": "Quote text (use *text* for emphasis)"
    }
  },
  "styleProps": {
    "bgFrom": {
      "type": "string",
      "default": "#667eea",
      "description": "Gradient start color"
    },
    "bgTo": {
      "type": "string",
      "default": "#764ba2", 
      "description": "Gradient end color"
    },
    "textColor": {
      "type": "string",
      "default": "#ffffff",
      "description": "Text color"
    },
    "fontSize": {
      "type": "string",
      "default": "72px",
      "description": "Font size"
    }
  }
}
```

**GET API usage**:
```
Basic:
GET /api/img/1200x630/Quote/The+only+way+to+do+*great+work*+is+to+love+what+you+do

Custom colors:
GET /api/img/1200x630/Quote/Do+what+you+*love*?bgFrom=ff6b6b&bgTo=feca57&textColor=2d3436

Different size:
GET /api/img/800x800/Quote/Be+*awesome*+today?fontSize=64px
```

### Example 2: Blog post cover with metadata

**Scenario**: User needs a blog post cover image with title, subtitle, and author info.

**Requirements gathered**:
- Purpose: Blog post OG images
- Content: Title, subtitle, author name
- Style: Left-aligned, clean, professional
- Layout: Title at top, subtitle below, author at bottom

**Generated template**:

```vue
<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
  author: string
  bgColor?: string
  accentCo

## Workflow

When generating an IMGX template, follow these 4 phases:

### 1. Gather requirements

Ask the user these questions:

**Purpose**
- What's the primary use case? (blog cover, social share card, badge, quote card, etc.)
- What platform is this for? (Twitter/X, WeChat, general web, etc.)

**Content structure**
- How many text fields do you need? (single title, title + subtitle, title + subtitle + author, etc.)
- Do you need emoji/icon support?
- Do you need multi-line text with separators (`+`)?
- Do you need accent text (`*emphasized*`)?

**Visual style**
- What's the visual style? (minimal, bold, gradient, with icons, geometric, etc.)
- Do you have a color scheme preference? (fixed colors or user-customizable?)
- Do you have a reference design or inspiration?

**Layout preferences**
- Alignment preference? (center, left, right, mixed)
- Single-column or multi-section layout?
- Background style? (solid, gradient, pattern, image)

### 2. Design layout

Based on requirements, choose a layout strategy:

**For simple single-focus cards** (quotes, badges, announcements)
- Center-aligned layout with `items-center justify-center`
- Large font size (text-6xl or larger)
- Minimal content wrapper padding
- Use gradient or solid background

**For structured content cards** (blog covers, social shares)
- Vertical flex layout with `flex-col justify-between`
- Multiple sections (header, main content, footer)
- Consistent padding and spacing
- Use semantic alignment (title left, author bottom-left)

**For icon-based cards** (feature highlights, stats)
- Horizontal layout with `flex-row items-center`
- Icon/emoji on left, text on right
- Use `gap-*` utilities for spacing
- Balance icon size with text size

**For multi-line text cards** (lists, agendas)
- Vertical flex with `flex-col` on content wrapper
- Use `v-for` to iterate over `content` array
- Consistent line spacing with `gap-*`
- Consider alternate styling for variety

### 3. Generate code

Follow this step-by-step process:

**Step 1: Define props interface**
```vue
<script setup lang="ts">
interface Props {
  // Content props (from URL path)
  title: string
  subtitle?: string
  author?: string
  
  // Style props (from query params)
  bgColor?: string
  titleColor?: string
  fontSize?: string
  padding?: string
}

const props = withDefaults(defineProps<Props>(), {
  // Provide sensible defaults
  bgColor: '#1a1a1a',
  titleColor: '#ffffff',
  fontSize: '64px',
  padding: '80px'
})
</script>
```

**Step 2: Build root container**
```vue
<template>
  <div class="w-full h-full flex items-center justify-center">
    <!-- Always start with w-full h-full flex -->
  </div>
</template>
```

**Step 3: Add background/content wrapper**
```vue
<div 
  class="w-full h-full flex items-center justify-center"
  :style="{ background: props.bgColor }"
>
  <div 
    class="flex flex-col gap-4"
    :style="{ padding: props.padding }"
  >
    <!-- Content goes here -->
  </div>
</div>
```

**Step 4: Render content fields**

For simple text:
```vue
<div 
  class="text-6xl font-bold text-center"
  :style="{ color: props.titleColor, fontSize: props.fontSize }"
>
  {{ props.title }}
</div>
```

For parsed content (with accent/emoji support):
```vue
<div class="text-6xl font-bold">
  <template v-for="(part, i) in parsedTitle" :key="i">
    <span v-if="part.type === 'normal'">{{ part.text }}</span>
    <span v-else-if="part.type === 'accent'" class="text-blue-400">
      {{ part.text }}
    </span>
    <img 
      v-else-if="part.type === 'emoji'" 
      :src="part.base64URL" 
      class="inline-block"
      style="width: 1em; height: 1em;"
    />
  </template>
</div>
```

**Step 5: Add helper functions if needed**
```vue
<script setup lang="ts">
import { parseContent } from '~/lib/content'

// ... props definition ...

const parsedTitle = computed(() => parseContent(props.title))
</script>
```

### 4. Provide usage

After generating the template code, provide:

**1. Complete Vue component code**
```vue
<script setup lang="ts">
// ... full code ...
</script>

<template>
  <!-- ... full template ... -->
</template>
```

**2. Props JSON with categories**
```json
{
  "contentProps": {
    "title": {
      "type": "string",
      "default": "Hello World",
      "description": "Main title text"
    }
  },
  "styleProps": {
    "bgColor": {
      "type": "string", 
      "default": "#1a1a1a",
      "description": "Background color"
    }
  }
}
```

**3. GET API examples**
```
Basic usage:
GET /api/img/1200x630/YourTemplate/Hello+World

With style params:
GET /api/img/1200x630/YourTemplate/Hello+World?bgColor=ff6b6b&titleColor=ffffff

With multi-field content (if applicable):
GET /api/img/1200x630/YourTemplate/Hello+World/Subtitle+Text/Author+Name
```

**4. Testing instructions**
```
1. Copy the template code
2. Go to http://localhost:4573/playground
3. Paste code in left editor
4. Paste props JSON in right editor
5. Adjust props and see live preview
6. Export when satisfied
```


## Examples

### Example 1: Minimalist quote card

**Scenario**: User wants a simple centered quote card with gradient background for social media sharing.

**Requirements gathered**:
- Purpose: Share inspirational quotes on Twitter
- Content: Single text field (the quote)
- Style: Minimal, centered, gradient background
- Support for emphasis text (`*word*`)

**Generated template**:

```vue
<script setup lang="ts">
import { parseContent } from '~/lib/content'

interface Props {
  quote: string
  bgFrom?: string
  bgTo?: string
  textColor?: string
  fontSize?: string
}

const props = withDefaults(defineProps<Props>(), {
  bgFrom: '#667eea',
  bgTo: '#764ba2',
  textColor: '#ffffff',
  fontSize: '72px'
})

const parsed = computed(() => parseContent(props.quote))
</script>

<template>
  <div 
    class="w-full h-full flex items-center justify-center"
    :style="{ 
      background: `linear-gradient(135deg, ${props.bgFrom}, ${props.bgTo})` 
    }"
  >
    <div 
      class="flex flex-col items-center text-center px-20"
      :style="{ maxWidth: '900px' }"
    >
      <div 
        class="font-bold leading-tight"
        :style="{ color: props.textColor, fontSize: props.fontSize }"
      >
        <template v-for="(part, i) in parsed" :key="i">
          <span v-if="part.type === 'normal'">{{ part.text }}</span>
          <span 
            v-else-if="part.type === 'accent'" 
            :style="{ color: props.bgFrom, background: props.textColor, padding: '0 8px' }"
          >
            {{ part.text }}
          </span>
        </template>
      </div>
    </div>
  </div>
</template>
```

**Props JSON**:
```json
{
  "contentProps": {
    "quote": {
      "type": "string",
      "default": "The only way to do *great work* is to love what you do",
      "description": "Quote text (use *text* for emphasis)"
    }
  },
  "styleProps": {
    "bgFrom": {
      "type": "string",
      "default": "#667eea",
      "description": "Gradient start color"
    },
    "bgTo": {
      "type": "string",
      "default": "#764ba2", 
      "description": "Gradient end color"
    },
    "textColor": {
      "type": "string",
      "default": "#ffffff",
      "description": "Text color"
    },
    "fontSize": {
      "type": "string",
      "default": "72px",
      "description": "Font size"
    }
  }
}
```

**GET API usage**:
```
Basic:
GET /api/img/1200x630/Quote/The+only+way+to+do+*great+work*+is+to+love+what+you+do

Custom colors:
GET /api/img/1200x630/Quote/Do+what+you+*love*?bgFrom=ff6b6b&bgTo=feca57&textColor=2d3436

Different size:
GET /api/img/800x800/Quote/Be+*awesome*+today?fontSize=64px
```

### Example 2: Blog post cover with metadata

**Scenario**: User needs a blog post cover image with title, subtitle, and author info.

**Requirements gathered**:
- Purpose: Blog post OG images
- Content: Title, subtitle, author name
- Style: Left-aligned, clean, professional
- Layout: Title at top, subtitle below, author at bottom

**Generated template**:

```vue
<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
  author: string
  bgColor?: string
  accentColor?: string
  textColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  bgColor: '#0f172a',
  accentColor: '#3b82f6',
  textColor: '#f1f5f9'
})
</script>

<template>
  <div 
    class="w-full h-full flex flex-col justify-between p-20"
    :style="{ background: props.bgColor }"
  >
    <!-- Top accent bar -->
    <div 
      class="w-32 h-2 rounded-full"
      :style="{ background: props.accentColor }"
    />
    
    <!-- Main content -->
    <div class="flex flex-col gap-6">
      <div 
        class="text-7xl font-black leading-tight"
        :style="{ color: props.textColor }"
      >
        {{ props.title }}
      </div>
      
      <div 
        class="text-3xl opacity-80"
        :style="{ color: props.textColor }"
      >
        {{ props.subtitle }}
      </div>
    </div>
    
    <!-- Author footer -->
    <div class="flex items-center gap-4">
      <div 
        class="w-3 h-3 rounded-full"
        :style="{ background: props.accentColor }"
      />
      <div 
        class="text-2xl font-medium"
        :style="{ color: props.textColor }"
      >
        {{ props.author }}
      </div>
    </div>
  </div>
</template>
```

**Props JSON**:
```json
{
  "contentProps": {
    "title": {
      "type": "string",
      "default": "Building Scalable APIs",
      "description": "Blog post title"
    },
    "subtitle": {
      "type": "string", 
      "default": "A practical guide to REST and GraphQL",
      "description": "Blog post subtitle"
    },
    "author": {
      "type": "string",
      "default": "Jane Developer",
      "description": "Author name"
    }
  },
  "styleProps": {
    "bgColor": {
      "type": "string",
      "default": "#0f172a",
      "description": "Background color"
    },
    "accentColor": {
      "type": "string",
      "default": "#3b82f6",
      "description": "Accent color for bars and dots"
    },
    "textColor": {
      "type": "string",
      "default": "#f1f5f9",
      "description": "Text color"
    }
  }
}
```

**GET API usage**:
```
Basic:
GET /api/img/1200x630/BlogCover/Building+Scalable+APIs/A+practical+guide/Jane+Developer

Custom theme:
GET /api/img/1200x630/BlogCover/GraphQL+vs+REST/Performance+comparison/Tech+Blog?bgColor=1a1a2e&accentColor=16c79a&textColor=eaeaea

Vertical format:
GET /api/img/1080x1920/BlogCover/Mobile+First+Design/Tips+and+tricks/Sarah+Chen
```


## Next steps after generation

After you generate a template, guide the user through these steps:

### 1. Copy to Playground for testing
```
1. Copy the complete <script setup> + <template> code
2. Navigate to http://localhost:4573/playground
3. Paste code in the left editor
4. Paste props JSON in the right editor
5. Click "Render" to see preview
```

### 2. Test with different content
```
- Try different text lengths (short, medium, long)
- Test special syntax: *accent*, [iconify:mdi:check], + separator
- Verify colors and sizes look good
- Check text doesn't overflow or get cut off
```

### 3. Adjust and iterate
```
- Modify font sizes if text doesn't fit
- Adjust padding/spacing for better balance  
- Try different color combinations
- Test at different image sizes (1200x630, 800x800, 1080x1920)
```

### 4. Export to template file
```
When satisfied with the template:
1. In Playground, click "导出为模板" (Export as Template)
2. Or manually create: components/template/YourName.vue
3. Paste the finalized code
```

### 5. Create template in admin
```
1. Go to http://localhost:4573 (Template Editor page)
2. Click "新建模板" (New Template)
3. Fill in template name (must match Vue filename)
4. Paste the props JSON
5. System will auto-generate propsSchema validation
6. Review and save
```

### 6. Create preset (optional)
```
1. Go to Preset Editor
2. Click "新建预设" (New Preset)  
3. Select your template from dropdown
4. Fill in default content and style values
5. Save and copy the preset code
```

### 7. Use in production
```
With template only:
GET /api/img/{size}/{TemplateName}/{content}

With preset:
GET /api/img/{PresetCode}

Examples:
GET /api/img/1200x630/BlogCover/My+Title/My+Subtitle/Author
GET /api/img/tech-blog-preset-001
```

### 8. (Optional) Add to template gallery
```
- Take a screenshot of a good example
- Document common use cases
- Share with team or community
```

## Questions to ask

Before generating, clarify these points with the user:

### 1. What's the primary use case?
- Blog post cover (OG image)
- Social media share card (Twitter, WeChat, etc.)
- Badge or label (certification, achievement)
- Quote or testimonial card
- Event announcement
- Product feature highlight
- Other (ask for details)

### 2. How many text fields are needed?
- Single text field (title only)
- Two fields (title + subtitle)
- Three fields (title + subtitle + metadata like author/date)
- Multiple lines (list items, agenda, etc.)
- Do you need the `+` separator for multi-line content?

### 3. What visual style do you prefer?
- Minimal and clean
- Bold and vibrant  
- Gradient backgrounds
- Geometric patterns
- With icons/emojis
- Professional/corporate
- Fun and playful
- Show me a reference image

### 4. Do you need special text features?
- Accent/emphasis text using `*word*` syntax?
- Emoji/icon support using `[iconify:name]` syntax?
- Multiple font sizes in same field?
- Text alignment options (left, center, right)?

### 5. Colors: fixed or customizable?
- Fixed colors (hardcoded in template) - simpler
- Customizable colors (via styleProps) - more flexible
- Preset themes (light, dark, brand colors)

### 6. Any reference or inspiration?
- Do you have a design mockup?
- Link to a similar card you like?
- Brand guidelines to follow?

### 7. What image size(s) will you use?
- Standard social (1200x630 for OG images)
- Square (800x800, 1080x1080)
- Vertical (1080x1920 for stories)
- Custom size
- Multiple sizes (adjust layout accordingly)


## Tips for great templates

### 1. Use semantic prop names
```vue
// Good
interface Props {
  title: string
  author: string
  publishDate: string
}

// Avoid
interface Props {
  text1: string
  text2: string
  text3: string
}
```

### 2. Provide sensible defaults
Every styleProps should have a default that looks good out of the box. Users can override if needed.

```vue
const props = withDefaults(defineProps<Props>(), {
  bgColor: '#1a1a1a',      // Dark background
  titleColor: '#ffffff',    // White text
  accentColor: '#3b82f6',   // Blue accent
  fontSize: '64px',         // Large readable text
  padding: '80px'           // Generous padding
})
```

### 3. Test with extreme content lengths
- Very short: "Hi"
- Medium: "Building Great Products"  
- Long: "The Complete Guide to Modern Web Development with React, TypeScript, and Advanced Patterns"
- Use `leading-tight` for long text to prevent overflow

### 4. Make layout responsive to content
```vue
<!-- Adjusts height based on content -->
<div class="flex flex-col gap-4">
  <div class="text-6xl">{{ title }}</div>
  <div v-if="subtitle" class="text-3xl">{{ subtitle }}</div>
</div>
```

### 5. Use consistent spacing system
Stick to Tailwind's spacing scale for visual consistency:
- `gap-2` (8px) for tight spacing
- `gap-4` (16px) for related items
- `gap-8` (32px) for distinct sections  
- `p-12` (48px), `p-16` (64px), `p-20` (80px) for padding

### 6. Add visual hierarchy
Use size, weight, and opacity to create hierarchy:
```vue
<div class="text-7xl font-black">Main Title</div>      <!-- Largest, boldest -->
<div class="text-3xl font-medium opacity-80">Subtitle</div>  <!-- Medium, less emphasis -->
<div class="text-xl opacity-60">Metadata</div>         <!-- Smallest, subtle -->
```

### 7. Consider color contrast
Ensure text is readable on backgrounds:
- Light text (#ffffff, #f1f5f9) on dark backgrounds
- Dark text (#1a1a1a, #2d3436) on light backgrounds  
- Use semi-transparent overlays if using background images
- Test with different bgColor values

### 8. Keep it simple
The best templates are often the simplest:
- Don't overcomplicate the layout
- Limit font sizes to 2-3 variants
- Use whitespace effectively
- One clear focal point

### 9. Document special features
If your template supports special syntax, mention it in prop descriptions:
```json
{
  "title": {
    "description": "Title text. Use *text* for emphasis, [iconify:mdi:check] for icons, + for line breaks"
  }
}
```

### 10. Think about reusability
Can this template work for multiple scenarios with different props?
```
Same template with different props:
- Tech blog cover → bgColor=#1a1a2e, accentColor=#16c79a
- Business blog → bgColor=#f8f9fa, accentColor=#2d3436  
- Personal blog → bgColor=#667eea, accentColor=#764ba2
```

---

## Ready to generate! 🎨

With this guide, you're equipped to:
- ✅ Understand Satori constraints and limitations
- ✅ Use the proven Base.vue pattern  
- ✅ Apply design patterns for common scenarios
- ✅ Ask the right questions to gather requirements
- ✅ Generate complete, production-ready templates
- ✅ Provide props JSON and usage examples
- ✅ Guide users through testing and deployment

**Start by asking the user about their use case, then follow the workflow!**

When generating templates, remember:
- Every `<div>` needs explicit `flex`
- Root element is always `class="w-full h-full"`
- Use `:style` bindings for customizable properties
- Test with the `parseContent()` function for accent/emoji support
- Provide complete code + props JSON + API examples
- Keep it simple, semantic, and reusable

Happy template generating! 🚀
