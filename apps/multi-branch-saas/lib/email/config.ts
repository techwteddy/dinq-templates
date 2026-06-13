import { Resend } from 'resend'

// Email is optional - will log warnings if not configured
const RESEND_API_KEY = process.env.RESEND_API_KEY

// Create Resend instance if API key is available
export const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

export const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'RepairShop <onboarding@resend.dev>',
  replyTo: process.env.EMAIL_REPLY_TO,
  enabled: !!RESEND_API_KEY,
} as const

// Log warning if email is not configured
if (!EMAIL_CONFIG.enabled && process.env.NODE_ENV !== 'test') {
  console.warn(
    '⚠️  Email service not configured. Set RESEND_API_KEY in .env to enable transactional emails.'
  )
}
