<script setup lang="ts">
// This page handles the OAuth callback from Supabase
// After Google authentication, users are redirected here

const supabase = useSupabaseClient()
const router = useRouter()

onMounted(async () => {
  // Exchange the code for a session
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Error getting session:', error)
    await router.push('/login')
    return
  }

  if (data?.session) {
    // Successfully authenticated, redirect to home
    console.log('start data.session')
    console.log(data.session)
    console.log('end data.session')

    await navigateTo('/')
  }
  else {
    // No session found, redirect to login
    await router.push('/login')
  }
})
</script>

<template>
  <div class="flex h-screen items-center justify-center">
    <div class="text-center">
      <Loader2 class="mx-auto h-8 w-8 animate-spin text-primary" />
      <p class="mt-4 text-sm text-muted-foreground">
        Completing sign in...
      </p>
    </div>
  </div>
</template>