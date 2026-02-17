export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()

  // If user is already logged in and trying to access auth pages
  if (user.value) {
    return navigateTo('/')
  }
})