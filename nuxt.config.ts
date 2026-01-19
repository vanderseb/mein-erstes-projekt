// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase'],

  // Supabase-Konfiguration
  supabase: {
    redirect: false,
    types: false // Deaktiviert - wir importieren Types manuell in Server-APIs
  },

  // Nitro Server-Konfiguration
  nitro: {
    rollupConfig: {
      onwarn(warning, handler) {
        // Supabase-interne unused imports ignorieren
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT' &&
          warning.exporter?.includes('@supabase')) {
          return
        }
        // Circular dependencies in nitropack/@nuxt ignorieren
        if (warning.code === 'CIRCULAR_DEPENDENCY' &&
          (warning.message?.includes('nitropack') || warning.message?.includes('@nuxt'))) {
          return
        }
        handler(warning)
      }
    }
  },

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