export type ContactPreference = 'whatsapp' | 'call' | 'telegram'

function normalizePhone(phone: string): string {
  const digits = phone.replace(/[\s\-().]/g, '')
  if (digits.startsWith('+')) return digits.slice(1)
  if (digits.startsWith('0039')) return digits.slice(2)
  if (digits.startsWith('39') && digits.length >= 11) return digits
  if (digits.startsWith('3') && digits.length === 10) return '39' + digits
  return digits
}

export function getContactLink(phone: string, preference: ContactPreference): string {
  const intl = normalizePhone(phone)
  switch (preference) {
    case 'whatsapp': return `https://wa.me/${intl}`
    case 'telegram': return `https://t.me/+${intl}`
    case 'call':     return `tel:+${intl}`
  }
}

export function getContactLabel(preference: ContactPreference): string {
  switch (preference) {
    case 'whatsapp': return 'WhatsApp'
    case 'telegram': return 'Telegram'
    case 'call':     return 'Chiama'
  }
}
