import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  ssr:false,
  vite: {
    plugins: [tailwindcss() as any],
  },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  pages: true,
  modules: [
    '@nuxtjs/supabase',
    '@nuxt/eslint'
  ],
  nitro: {
    experimental: {
      websocket: true
    }
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_PUBLISHABLE_KEY,
    redirect: false
  }
})