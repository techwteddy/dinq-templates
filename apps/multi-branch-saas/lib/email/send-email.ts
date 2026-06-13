import { render } from '@react-email/render'
import { resend, EMAIL_CONFIG } from './config'
import { WelcomeEmail } from './templates/welcome-email'
import { PasswordResetEmail } from './templates/password-reset-email'
import { RoleChangedEmail } from './templates/role-changed-email'
import { AccountStatusChangedEmail } from './templates/account-status-changed-email'

export interface SendEmailResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(params: {
  to: string
  userName: string
  userEmail: string
  loginUrl?: string
}): Promise<SendEmailResult> {
  try {
    // Check if email service is configured
    if (!resend) {
      console.warn('Email service not configured, skipping welcome email')
      return {
        success: false,
        error: 'Email service not configured',
      }
    }

    const loginUrl =
      params.loginUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`

    const html = await render(
      WelcomeEmail({
        userName: params.userName,
        userEmail: params.userEmail,
        loginUrl,
      })
    )

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: params.to,
      subject: 'Welcome to RepairShop!',
      html,
      ...(EMAIL_CONFIG.replyTo && { replyTo: EMAIL_CONFIG.replyTo }),
    })

    if (error) {
      console.error('Error sending welcome email:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      messageId: data?.id,
    }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(params: {
  to: string
  userName: string
  resetToken: string
  expiresIn?: string
}): Promise<SendEmailResult> {
  try {
    // Check if email service is configured
    if (!resend) {
      console.warn('Email service not configured, skipping password reset email')
      return {
        success: false,
        error: 'Email service not configured',
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/reset-password?token=${params.resetToken}`

    const html = await render(
      PasswordResetEmail({
        userName: params.userName,
        resetUrl,
        expiresIn: params.expiresIn || '1 hour',
      })
    )

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: params.to,
      subject: 'Password Reset Request - RepairShop',
      html,
      ...(EMAIL_CONFIG.replyTo && { replyTo: EMAIL_CONFIG.replyTo }),
    })

    if (error) {
      console.error('Error sending password reset email:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      messageId: data?.id,
    }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send test email (for debugging)
 */
export async function sendTestEmail(to: string): Promise<SendEmailResult> {
  try {
    if (!resend) {
      return {
        success: false,
        error: 'Email service not configured',
      }
    }

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject: 'Test Email - RepairShop',
      html: '<p>This is a test email from RepairShop. If you received this, email integration is working!</p>',
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      messageId: data?.id,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send role changed notification email
 */
export async function sendRoleChangedEmail(params: {
  to: string
  userName: string
  oldRoles: string[]
  newRoles: string[]
  changedBy: string
}): Promise<SendEmailResult> {
  try {
    if (!resend) {
      console.warn('Email service not configured, skipping role changed email')
      return {
        success: false,
        error: 'Email service not configured',
      }
    }

    const html = await render(
      RoleChangedEmail({
        userName: params.userName,
        oldRoles: params.oldRoles,
        newRoles: params.newRoles,
        changedBy: params.changedBy,
      })
    )

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: params.to,
      subject: 'Your Role Assignments Have Been Updated - RepairShop',
      html,
      ...(EMAIL_CONFIG.replyTo && { replyTo: EMAIL_CONFIG.replyTo }),
    })

    if (error) {
      console.error('Error sending role changed email:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      messageId: data?.id,
    }
  } catch (error) {
    console.error('Error sending role changed email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send account status changed notification email
 */
export async function sendAccountStatusChangedEmail(params: {
  to: string
  userName: string
  newStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  changedBy: string
  reason?: string
}): Promise<SendEmailResult> {
  try {
    if (!resend) {
      console.warn('Email service not configured, skipping account status changed email')
      return {
        success: false,
        error: 'Email service not configured',
      }
    }

    const statusText = {
      ACTIVE: 'Activated',
      INACTIVE: 'Deactivated',
      SUSPENDED: 'Suspended',
    }

    const html = await render(
      AccountStatusChangedEmail({
        userName: params.userName,
        newStatus: params.newStatus,
        changedBy: params.changedBy,
        reason: params.reason,
      })
    )

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: params.to,
      subject: `Your Account Has Been ${statusText[params.newStatus]} - RepairShop`,
      html,
      ...(EMAIL_CONFIG.replyTo && { replyTo: EMAIL_CONFIG.replyTo }),
    })

    if (error) {
      console.error('Error sending account status changed email:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      messageId: data?.id,
    }
  } catch (error) {
    console.error('Error sending account status changed email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
