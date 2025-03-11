// https://nuxt.com/docs/api/configuration/nuxt-config
import vue from '@vitejs/plugin-vue'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
// @ts-ignore
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')
)

import { createRequire } from 'module'

const { resolve } = createRequire(import.meta.url)

const prismaClient = `prisma${path.sep}client`

const prismaClientIndexBrowser = resolve('@prisma/client/index-browser').replace(`@${prismaClient}`, `.${prismaClient}`)

const appVersion = packageJson.version
export default defineNuxtConfig({
  compatibilityDate: '2025-02-08',
  devtools: { enabled: true },
  // future: {
  //   compatibilityVersion: 4
  // },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    'motion-v/nuxt',
    'unplugin-font-to-buffer/nuxt',
    '@nuxt/icon',
  ],
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  vite: {
    resolve: {
      alias: {
        ".prisma/client/index-browser": path.relative(__dirname, prismaClientIndexBrowser)
      }
    }
  },
  icon: {
    componentName: 'NuxtIcon',
  },
  colorMode: {
    preference: 'dark',
    fallback: 'dark'
  },
  runtimeConfig: {
    public: {
      appVersion
    }
  },
  nitro: {
    rollupConfig: {
      //@ts-ignore
      plugins: [
        vue()
      ]
    },
    imports: {
      presets: [
        {
          from: 'zod',
          imports: ['z']
        },
        {
          from: 'h3-zod',
          imports: ['useSafeValidatedQuery', 'useSafeValidatedBody', 'useValidatedParams', 'zh']
        }
      ]
    },
  }
})
