import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | number | Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function getBasePath() {
  return process.env.NEXT_PUBLIC_BASE_PATH || process.env.BASE_PATH || '';
}

export function getAssetPath(path: string) {
  if (!path) return path;
  if (path.startsWith('http')) return path;

  const basePath = getBasePath().replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // If path already starts with basePath, don't prepend it again
  if (basePath && cleanPath.startsWith(basePath)) {
    return cleanPath;
  }

  return `${basePath}${cleanPath}`;
}
