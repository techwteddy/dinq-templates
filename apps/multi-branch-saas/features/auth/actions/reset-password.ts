'use server'

import { createClient } from '@/lib/supabase/server'
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validation/auth.schema'
import type { ActionResult } from '../types'

/**
 * Reset user password with new password
 * Requires valid reset token from email link
 */
export async function resetPasswordAction(input: ResetPasswordInput): Promise<ActionResult<void>> {
  try {
    // Validate input
    const validated = resetPasswordSchema.parse(input)
    const { password } = validated

    // Create Supabase client
    const supabase = await createClient()

    // Update password
    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      console.error('Password reset error:', error)

      // Handle specific error cases
      if (error.message.includes('same as the old password')) {
        return {
          success: false,
          error: 'New password must be different from your current password',
        }
      }

      return {
        success: false,
        error: 'Failed to reset password. The reset link may have expired.',
      }
    }

    return {
      success: true,
      message:
        'Your password has been reset successfully. You can now log in with your new password.',
    }
  } catch (error) {
    console.error('Reset password action error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}
