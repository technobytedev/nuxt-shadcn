export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()

  // If user is not logged in and trying to access protected route
  if (!user?.value) {
    return navigateTo('/login')
  }
})