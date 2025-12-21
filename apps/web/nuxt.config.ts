export default defineNuxtConfig({
  devServer: {
    port: 3001
  },
  compatibilityDate: '2025-07-15',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
  ],
  // @ts-ignore - Module types might not be augmented yet
  image: {
    domains: ['localhost'],
  },
  runtimeConfig: {
    public: {
      payloadBaseUrl: process.env.PAYLOAD_BASE_URL || 'http://localhost:3000',
    }
  }
})
