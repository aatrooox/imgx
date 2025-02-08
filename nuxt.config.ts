// https://nuxt.com/docs/api/configuration/nuxt-config
import vue from '@vitejs/plugin-vue'

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
    'unplugin-font-to-buffer/nuxt'
  ],
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  colorMode: {
    preference: 'dark',
    fallback: 'dark'
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
