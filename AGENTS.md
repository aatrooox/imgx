# AGENTS.md - Guide for Coding Agents

This document provides essential information for AI coding agents working on the IMGX project.

## Project Overview

IMGX is a Nuxt 3 application that generates card images from text via API. It uses Vue 3, TypeScript, Tailwind CSS, Prisma ORM, and the Satori library to convert Vue components into images.

## Build, Dev & Release Commands

### Development
pnpm dev              # Start dev server on port 4573 with auto-open

### Build & Deploy
pnpm build            # Build for production
pnpm generate         # Generate static site
pnpm preview          # Preview production build
pnpm postinstall      # Run after install (nuxt prepare)

### Release Management
pnpm release          # Patch version bump + changelog + push
pnpm release:patch    # Same as above
pnpm release:minor    # Minor version bump + changelog + push
pnpm release:major    # Major version bump + changelog + push

### Utilities
pnpm extract          # Extract face icons (custom script)

### Testing
Note: This project currently has no automated test suite. Manual testing is done via dev server.

## Package Manager

Use pnpm exclusively - specified in package.json (pnpm@9.15.4)

## Code Style Guidelines

### TypeScript

#### Type Safety
- Always use TypeScript for new files (.ts, .vue)
- Define explicit types for function parameters and return values
- Use type for object shapes, interface for extendable contracts
- Leverage Nuxt's auto-imports for composables and utils

#### Import Order
1. External dependencies (Vue, Nuxt, third-party libs)
2. Type imports (with type keyword)
3. Local utilities and libs (~/lib/*, ~/utils/*)
4. Assets (fonts, images)
5. Components (auto-imported by Nuxt)

#### Import Style Examples
// Correct
import { Resvg } from '@resvg/resvg-js'
import type { Component } from 'vue'
import { satori, html } from '~/utils/satori'
import BiaoTiHei from '~/assets/fonts/YouSheBiaoTiHei-2.ttf'

// Avoid - Missing 'type' keyword
import { Component } from 'vue'

### Vue Components

#### Script Setup
- Use <script setup lang="ts"> for all components
- Define props with TypeScript interfaces
- Use defineProps, defineEmits with type parameters

#### Component Organization
1. Imports
2. Type definitions
3. Props & emits
4. Composables
5. State (ref, reactive)
6. Computed properties
7. Methods
8. Lifecycle hooks

### API Routes & Server

#### File Naming
- Use bracket notation for dynamic routes: [param].get.ts, [...slug].ts
- Number-prefix middleware by execution order: 1.auth0.ts, 2.rateLimit.ts

#### Event Handler Pattern
export default defineEventHandler(async (event) => {
  // 1. Extract params
  const param = getRouterParam(event, 'param')
  
  // 2. Validate input with Zod
  const query = await useSafeValidatedQuery(event, schema)
  
  // 3. Check validation
  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: query.message ?? '参数错误'
    })
  }
  
  // 4. Process and return
  return processData(query.data)
})

#### Error Handling
- Use createError for HTTP errors
- Use try-catch for async operations
- Include Chinese error messages when appropriate (this project uses mixed CN/EN)

### Styling with Tailwind CSS

#### Best Practices
- Use Tailwind utilities in templates
- Use responsive prefixes: sm:, md:, lg:
- Combine with cn() helper for conditional classes
- Dynamic styles via :style binding when Tailwind isn't sufficient

### Naming Conventions

#### Variables & Functions
- Use camelCase: isLoading, downloadImage, baseUrl
- Boolean variables: is*, has*, should* prefix
- Event handlers: handle* or on* prefix

#### Components
- Use PascalCase for component files: SchemaEditor.vue, PreviewWraper.vue
- UI components in components/ui/ follow shadcn-vue naming

#### Constants
- Use UPPER_SNAKE_CASE for true constants
- Use camelCase for configuration objects

### Comments & Documentation
- Add comments for complex business logic
- Chinese comments are acceptable (project uses mixed CN/EN)
- Document API parameters in Zod schemas with inline comments

## Project-Specific Patterns

### Image Generation Flow
1. Route handler extracts text, size, template from URL
2. Validate params with Zod schemas
3. Load Vue component dynamically via serverTemplates
4. Render component to SVG using Satori
5. Convert SVG to PNG using Resvg
6. Return image with caching headers (ETag)

### Component Props Parsing
- Props split into contentProps (text content) and styleProps (visual styling)
- Content passed via URL path segments, styles via query params
- Merged with preset defaults

### Authentication Middleware
- JWT validation in server/middleware/1.auth0.ts
- Token stored in cookies
- White-listed routes bypass auth

## Common Pitfalls

1. Font Loading: Custom fonts must be imported as buffers for Satori
2. Prisma Client: Uses custom alias for browser compatibility (.prisma/client/index-browser)
3. Auto-imports: Nuxt auto-imports composables, utils, and components - no manual imports needed
4. API Proxy: /api/v1/** routes proxied to external service (localhost:5777)
5. Cache Control: Image routes use ETag for browser caching

## File Structure

components/          # Vue components (auto-imported)
  ui/               # shadcn-vue UI components
  preset/           # Preset editor components
  *.vue             # Feature components
lib/                # Shared TypeScript utilities
  schema.ts         # Zod validation schemas
  template.ts       # Template management
  utils.ts          # Helper functions (cn, etc.)
pages/              # Nuxt pages (file-based routing)
server/             # Nitro server
  api/              # API endpoints
  middleware/       # Server middleware
  routes/           # Custom routes
  utils/            # Server utilities
utils/              # Client utilities
assets/             # Static assets (fonts, images)

## Key Dependencies

- Nuxt 4: Meta-framework (Vue + SSR + file routing)
- Satori: Convert HTML/CSS to SVG
- Resvg: Convert SVG to PNG
- Zod: Schema validation with h3-zod for Nuxt integration
- Prisma: Database ORM
- shadcn-vue: UI component library
- Tailwind CSS: Utility-first CSS framework

## Additional Notes

- Project uses ES modules ("type": "module" in package.json)
- Nuxt compatibility date: 2025-02-08
- Dev server runs on port 4573
- Runtime config in nuxt.config.ts for environment variables
- No test suite currently - manual testing via dev server
