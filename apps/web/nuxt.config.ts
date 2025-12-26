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
  },
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap' }
      ]
    }
  }
})
