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

const appVersion = packageJson.version
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  // future: {
  //   compatibilityVersion: 4
  // },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    'motion-v/nuxt',
    'unplugin-font-to-buffer/nuxt',
    '@nuxt/icon'
  ],
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  icon: {
    componentName: 'NuxtIcon',
    clientBundle: {
      scan: true,
      includeCustomCollections: true,
      // sizeLimitKb: 256,
    }
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
    }
  }
})
