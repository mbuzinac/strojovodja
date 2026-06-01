// Za GitHub Pages: '/' ako je repo strojovodja.github.io, '/ime-repoa/' za project page
const baseURL = process.env.NUXT_APP_BASE_URL || '/'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@vite-pwa/nuxt'],

  app: {
    baseURL,
    head: {
      title: 'Strojovođa – Prometni i signalni propisi',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Mobilna PWA aplikacija za učenje željezničkih prometnih i signalnih propisa' },
        { name: 'theme-color', content: '#0f172a' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: `${baseURL}icon.svg`.replace(/([^:]\/)\/+/g, '$1') },
        { rel: 'apple-touch-icon', href: `${baseURL}icon.svg`.replace(/([^:]\/)\/+/g, '$1') },
      ],
    },
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Strojovođa – Signalni propisi',
      short_name: 'Strojovođa',
      description: 'Učenje željezničkih prometnih i signalnih propisa',
      theme_color: '#0f172a',
      background_color: '#020617',
      display: 'standalone',
      orientation: 'portrait',
      lang: 'hr',
      start_url: baseURL,
      icons: [
        { src: `${baseURL}icon.svg`.replace(/([^:]\/)\/+/g, '$1'), sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,webp,ico,mp3,woff2}'],
      navigateFallback: baseURL,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      type: 'module',
      suppressWarnings: true,
    },
  },
})
