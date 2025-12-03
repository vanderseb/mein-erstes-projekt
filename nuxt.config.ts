// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],

  // Globale CSS-Datei einbinden
  css: ['~/assets/css/main.css'],

  // App-Konfiguration
  app: {
    head: {
      title: 'Dr. Evil & Söhne GmbH',
      meta: [
        { name: 'description', content: 'Tradition trifft Tyrannei seit 1965 - Ihr Partner für Premium-Weltherrschaft' }
      ],
      // Favicon
      link: [
        { rel: 'icon', type: 'image/png', href: '/design/assets/logo/Logo_Icon_dunkler_Hintergrund.png' }
      ]
    }
  }
})