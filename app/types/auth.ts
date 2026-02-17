import type { User } from '@supabase/supabase-js'

export interface AuthUser extends User {
  // Add custom user fields if needed
}

export interface AuthError {
  message: string
  status?: number
}

export interface SignInCredentials {
  email: string
  password: string
}

export interface SignUpCredentials extends SignInCredentials {
  confirmPassword?: string
}