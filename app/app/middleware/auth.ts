export default defineNuxtRouteMiddleware((to, from) => {
    const user = useSupabaseUser()
    if (to.path.startsWith('/auth')) return
    if(!user.value) return navigateTo('/auth/login')
})