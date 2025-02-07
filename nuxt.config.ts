// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  // future: {
  //   compatibilityVersion: 4
  // },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    'motion-v/nuxt'
  ],
  shadcn: {
    prefix: 'ui',
    componentDir: './components/ui'
  },
  colorMode: {
    preference: 'dark',
    fallback: 'dark'
  }
})
