'use server'

import { createClient } from '@/lib/supabase/server'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validation/auth.schema'
import type { ActionResult } from '../types'

/**
 * Send password reset email to user
 * Uses Supabase Auth's built-in password reset flow
 */
export async function forgotPasswordAction(
  input: ForgotPasswordInput
): Promise<ActionResult<void>> {
  try {
    // Validate input
    const validated = forgotPasswordSchema.parse(input)
    const { email } = validated

    // Create Supabase client
    const supabase = await createClient()

    // Send password reset email via Supabase Auth
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    })

    if (error) {
      console.error('Password reset error:', error)
      return {
        success: false,
        error: 'Failed to send password reset email. Please try again.',
      }
    }

    return {
      success: true,
      message:
        'If an account exists with this email, you will receive a password reset link shortly.',
    }
  } catch (error) {
    console.error('Forgot password action error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}
