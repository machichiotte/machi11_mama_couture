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
  nitro: {
    preset: 'cloudflare-pages'
  },
  image: {
    domains: [
      'localhost',
      'free-glyn-machichiotte-61a9f3f6.koyeb.app',
      'res.cloudinary.com'
    ],
  },
  ssr: true,
  routeRules: {
    // Proxy vers le CMS pour l'admin et l'API
    // On utilise des redirections serveur pures pour éviter les conflits d'hydratation
    '/admin': { proxy: `${process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'}/admin` },
    '/admin/**': { proxy: `${process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'}/admin/**` },
    '/api/**': { proxy: `${process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/**` },
    '/_next/**': { proxy: `${process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'}/_next/**` },

    // Désactiver le prerendering global
    '/**': { ssr: true, prerender: false }
  },
  runtimeConfig: {
    public: {
      payloadBaseUrl: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
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
