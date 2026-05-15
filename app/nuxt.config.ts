// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
<<<<<<< Updated upstream
=======
  vite: {
    plugins: [tailwindcss()],
  },
  css: ['~/assets/css/main.css'],
>>>>>>> Stashed changes
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY,
    }
  },
  modules: [
    '@nuxtjs/supabase',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss'
  ]
})