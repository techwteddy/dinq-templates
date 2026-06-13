'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema, type LoginInput } from '@/lib/validation/auth.schema'
import type { ActionResult } from '../types'

export async function login(data: LoginInput): Promise<ActionResult> {
  // Validate input
  const validation = loginSchema.safeParse(data)

  if (!validation.success) {
    return {
      success: false,
      error: 'Invalid input',
      errors: validation.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validation.data

  try {
    const supabase = await createClient()

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      return {
        success: false,
        error: authError.message || 'Failed to login',
      }
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'Authentication failed',
      }
    }

    // Revalidate and redirect
    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }

  // Redirect after successful login
  redirect('/')
}
