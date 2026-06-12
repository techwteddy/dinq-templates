import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hashIp(ip: string): string {
  // Simple SHA-256-like stub for demo; replace with Node crypto in production
  if (typeof window === 'undefined') {
    // Server-side: use crypto if available
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(ip).digest('hex');
  }
  return ip;
}

export function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}
