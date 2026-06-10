/**
 * Color Contrast Utility
 * Calculates WCAG color contrast ratios to ensure accessibility compliance
 */

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance of a color
 * https://www.w3.org/TR/WCAG20-TECHS/G17.html
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * https://www.w3.org/TR/WCAG20-TECHS/G17.html
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    throw new Error('Invalid color format. Use hex colors like #ffffff');
  }

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standards
 */
export function meetsWCAGAA(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): { passes: boolean; ratio: number; required: number } {
  const ratio = getContrastRatio(foreground, background);
  const required = isLargeText ? 3 : 4.5;
  
  return {
    passes: ratio >= required,
    ratio: Math.round(ratio * 100) / 100,
    required,
  };
}

/**
 * Check if contrast ratio meets WCAG AAA standards
 */
export function meetsWCAGAAA(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): { passes: boolean; ratio: number; required: number } {
  const ratio = getContrastRatio(foreground, background);
  const required = isLargeText ? 4.5 : 7;
  
  return {
    passes: ratio >= required,
    ratio: Math.round(ratio * 100) / 100,
    required,
  };
}

/**
 * Color palette from tailwind.config.js
 */
export const colorPalette = {
  dark: {
    DEFAULT: '#0a0a0a',
    lighter: '#1a1a1a',
    card: '#141414',
  },
  accent: {
    primary: '#2563eb', // WCAG AA compliant: 5.17:1 with white
    secondary: '#10b981',
    hover: '#1d4ed8', // 6.70:1 with white
  },
  text: {
    primary: '#ffffff',
    secondary: '#a3a3a3',
    muted: '#7a7a7a', // WCAG AA compliant: 4.61:1 on dark backgrounds
  },
  // Additional common colors used in components
  gray: {
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    900: '#111827',
    950: '#030712',
  },
  white: '#ffffff',
  black: '#000000',
};

/**
 * Audit all color combinations used in the design
 */
export function auditColorCombinations() {
  const combinations = [
    // Dark mode combinations (primary use case)
    { name: 'White text on dark background', fg: colorPalette.white, bg: colorPalette.dark.DEFAULT, large: false },
    { name: 'White text on dark card', fg: colorPalette.white, bg: colorPalette.dark.card, large: false },
    { name: 'Gray-300 text on dark background', fg: colorPalette.gray[300], bg: colorPalette.dark.DEFAULT, large: false },
    { name: 'Gray-300 text on dark card', fg: colorPalette.gray[300], bg: colorPalette.dark.card, large: false },
    { name: 'Gray-400 text on dark background', fg: colorPalette.gray[400], bg: colorPalette.dark.DEFAULT, large: false },
    { name: 'Gray-400 text on dark card', fg: colorPalette.gray[400], bg: colorPalette.dark.card, large: false },
    { name: 'Text muted on dark background', fg: colorPalette.text.muted, bg: colorPalette.dark.DEFAULT, large: false },
    { name: 'Text secondary on dark background', fg: colorPalette.text.secondary, bg: colorPalette.dark.DEFAULT, large: false },
    { name: 'Accent primary on dark background (normal text)', fg: colorPalette.accent.primary, bg: colorPalette.dark.DEFAULT, large: false },
    { name: 'Accent primary on dark background (large text)', fg: colorPalette.accent.primary, bg: colorPalette.dark.DEFAULT, large: true },
    { name: 'White text on accent primary', fg: colorPalette.white, bg: colorPalette.accent.primary, large: false },
    
    // Light mode combinations (for comparison)
    { name: 'Gray-700 text on gray-100 background', fg: colorPalette.gray[700], bg: colorPalette.gray[100], large: false },
    { name: 'Gray-600 text on gray-100 background', fg: colorPalette.gray[600], bg: colorPalette.gray[100], large: false },
    { name: 'Gray-500 text on white background', fg: colorPalette.gray[500], bg: colorPalette.white, large: false },
    
    // Button combinations
    { name: 'White text on gray-900', fg: colorPalette.white, bg: colorPalette.gray[900], large: false },
    { name: 'Gray-500 text on white (button)', fg: colorPalette.gray[500], bg: colorPalette.white, large: false },
  ];

  const results = combinations.map((combo) => {
    const result = meetsWCAGAA(combo.fg, combo.bg, combo.large);
    return {
      ...combo,
      ...result,
      status: result.passes ? '✓ PASS' : '✗ FAIL',
    };
  });

  return results;
}
