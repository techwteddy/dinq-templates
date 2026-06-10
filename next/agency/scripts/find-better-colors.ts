/**
 * Find better WCAG AA compliant colors that maintain visual design
 */

import { getContrastRatio } from '../lib/color-contrast';

// Helper to convert RGB to hex
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Helper to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) throw new Error('Invalid hex color');
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

console.log('================================================================================');
console.log('FINDING OPTIMAL WCAG AA COMPLIANT COLORS');
console.log('================================================================================');

// For text-muted: Find the darkest color that still meets 4.5:1
console.log('\n=== text-muted (on #0a0a0a background) ===');
const darkBg = '#0a0a0a';
const currentMuted = '#737373';
console.log(`Current: ${currentMuted} (ratio: ${getContrastRatio(currentMuted, darkBg).toFixed(2)}:1) ❌`);

// Try some candidates
const mutedCandidates = ['#787878', '#7a7a7a', '#7c7c7c', '#7e7e7e', '#808080'];
console.log('\nCandidates:');
mutedCandidates.forEach(color => {
  const ratio = getContrastRatio(color, darkBg);
  const passes = ratio >= 4.5;
  console.log(`  ${color}: ${ratio.toFixed(2)}:1 ${passes ? '✓' : '❌'}`);
});

// For accent-primary: Find options that work with white text
console.log('\n=== accent-primary (with white text) ===');
const whiteFg = '#ffffff';
const currentAccent = '#3b82f6';
console.log(`Current: ${currentAccent} (ratio: ${getContrastRatio(whiteFg, currentAccent).toFixed(2)}:1) ❌`);

// Try some blue candidates that are darker
const accentCandidates = [
  '#2563eb', // Tailwind blue-600
  '#1d4ed8', // Tailwind blue-700
  '#1e40af', // Tailwind blue-800
  '#3472d8', // Our calculated value
  '#2e6bc9', // Slightly lighter
  '#3570d0', // Between current and calculated
];

console.log('\nCandidates:');
accentCandidates.forEach(color => {
  const ratio = getContrastRatio(whiteFg, color);
  const passes = ratio >= 4.5;
  console.log(`  ${color}: ${ratio.toFixed(2)}:1 ${passes ? '✓' : '❌'}`);
});

// Also check if the current hover color is compliant
console.log('\n=== Current hover color ===');
const currentHover = '#2563eb';
const hoverRatio = getContrastRatio(whiteFg, currentHover);
console.log(`hover (#2563eb): ${hoverRatio.toFixed(2)}:1 ${hoverRatio >= 4.5 ? '✓' : '❌'}`);

console.log('\n================================================================================');
console.log('RECOMMENDATIONS');
console.log('================================================================================');
console.log('\n1. text.muted: #787878 or #7a7a7a');
console.log('   - Minimal change from current #737373');
console.log('   - Maintains visual design while meeting WCAG AA');
console.log('\n2. accent.primary: #2563eb (Tailwind blue-600)');
console.log('   - This is already the hover color!');
console.log('   - Swap primary and hover colors');
console.log('   - New hover can be #1d4ed8 (Tailwind blue-700)');
console.log('\n');
