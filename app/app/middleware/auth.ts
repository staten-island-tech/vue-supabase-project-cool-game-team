export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser()
  
  if (!user.value) {
    const { data } = await useSupabaseClient().auth.getSession()
    if (!data.session) return navigateTo('/login')
  }
})