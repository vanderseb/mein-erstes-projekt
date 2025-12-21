// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],

  // Supabase Umgebungsvariablen für den Client zugänglich machen
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
    }
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Dr. Evil & Söhne GmbH',
      meta: [
        { name: 'description', content: 'Tradition trifft Tyrannei seit 1965 - Ihr Partner für Premium-Weltherrschaft' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/design/assets/logo/Logo_Icon_dunkler_Hintergrund.png' }
      ]
    }
  }
})