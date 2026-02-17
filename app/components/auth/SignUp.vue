<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import PasswordInput from '~/components/PasswordInput.vue'

const { signInWithGoogle, signUpWithEmail } = useAuth()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const isGoogleLoading = ref(false)

async function handleGoogleSignIn() {
  try {
    isGoogleLoading.value = true
    await signInWithGoogle()
  }
  catch (error: any) {
    console.error('Google sign in error:', error)
    toast.error('Failed to sign in with Google', {
      description: error.message || 'Please try again',
    })
  }
  finally {
    isGoogleLoading.value = false
  }
}

async function onSubmit(event: Event) {
  event.preventDefault()

  if (!email.value || !password.value || !confirmPassword.value) {
    toast.error('Missing fields', {
      description: 'Please fill in all fields',
    })
    return
  }

  if (password.value !== confirmPassword.value) {
    toast.error('Passwords do not match', {
      description: 'Please make sure your passwords match',
    })
    return
  }

  if (password.value.length < 6) {
    toast.error('Password too short', {
      description: 'Password must be at least 6 characters',
    })
    return
  }

  try {
    isLoading.value = true

    await signUpWithEmail(email.value, password.value)

    toast.success('Account created!', {
      description: 'Please check your email to verify your account',
    })

    // Redirect to login or verification page
    await navigateTo('/login')
  }
  catch (error: any) {
    console.error('Sign up error:', error)
    toast.error('Failed to create account', {
      description: error.message || 'Please try again',
    })
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form class="grid gap-6" @submit="onSubmit">
    <div class="flex flex-col gap-4">
      <Button
        variant="outline"
        class="w-full gap-2"
        type="button"
        :disabled="isGoogleLoading || isLoading"
        @click="handleGoogleSignIn"
      >
        <Loader2 v-if="isGoogleLoading" class="h-4 w-4 animate-spin" />
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-4">
          <path
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            fill="currentColor"
          />
        </svg>
        Sign up with Google
      </Button>
    </div>

    <Separator label="Or continue with" />

    <div class="grid gap-2">
      <Label for="email">
        Email
      </Label>
      <Input
        id="email"
        v-model="email"
        type="email"
        placeholder="name@example.com"
        :disabled="isLoading || isGoogleLoading"
        auto-capitalize="none"
        auto-complete="email"
        auto-correct="off"
        required
      />
    </div>

    <div class="grid gap-2">
      <Label for="password">
        Password
      </Label>
      <PasswordInput
        id="password"
        v-model="password"
        :disabled="isLoading || isGoogleLoading"
        placeholder="Enter your password"
        required
      />
    </div>

    <div class="grid gap-2">
      <Label for="confirm-password">
        Confirm Password
      </Label>
      <PasswordInput
        id="confirm-password"
        v-model="confirmPassword"
        :disabled="isLoading || isGoogleLoading"
        placeholder="Confirm your password"
        required
      />
    </div>

    <Button type="submit" class="w-full" :disabled="isLoading || isGoogleLoading">
      <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
      Create Account
    </Button>
  </form>

  <div class="mt-4 text-center text-sm text-muted-foreground">
    Already have an account?
    <NuxtLink to="/login" class="underline">
      Sign in
    </NuxtLink>
  </div>
</template>