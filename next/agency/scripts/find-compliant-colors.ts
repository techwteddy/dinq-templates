/**
 * Find WCAG AA compliant colors
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

// Find a lighter version of text-muted that meets 4.5:1 contrast
function findCompliantTextMuted() {
  const darkBg = '#0a0a0a';
  const currentMuted = '#737373';
  const targetRatio = 4.5;
  
  console.log('\n=== Finding compliant text-muted color ===');
  console.log(`Current: ${currentMuted} (ratio: ${getContrastRatio(currentMuted, darkBg).toFixed(2)}:1)`);
  
  const rgb = hexToRgb(currentMuted);
  
  // Increase lightness until we meet the target
  for (let i = 0; i < 100; i++) {
    const factor = 1 + (i * 0.01);
    const newR = Math.min(255, rgb.r * factor);
    const newG = Math.min(255, rgb.g * factor);
    const newB = Math.min(255, rgb.b * factor);
    const newHex = rgbToHex(newR, newG, newB);
    const ratio = getContrastRatio(newHex, darkBg);
    
    if (ratio >= targetRatio) {
      console.log(`✓ Found: ${newHex} (ratio: ${ratio.toFixed(2)}:1)`);
      console.log(`  Lightness increase: ${(factor * 100 - 100).toFixed(1)}%`);
      return newHex;
    }
  }
  
  return null;
}

// Find a darker version of accent-primary that meets 4.5:1 contrast with white
function findCompliantAccentPrimary() {
  const whiteFg = '#ffffff';
  const currentAccent = '#3b82f6';
  const targetRatio = 4.5;
  
  console.log('\n=== Finding compliant accent-primary color ===');
  console.log(`Current: ${currentAccent} (ratio: ${getContrastRatio(whiteFg, currentAccent).toFixed(2)}:1)`);
  
  const rgb = hexToRgb(currentAccent);
  
  // Decrease lightness until we meet the target
  for (let i = 0; i < 100; i++) {
    const factor = 1 - (i * 0.01);
    const newR = Math.max(0, rgb.r * factor);
    const newG = Math.max(0, rgb.g * factor);
    const newB = Math.max(0, rgb.b * factor);
    const newHex = rgbToHex(newR, newG, newB);
    const ratio = getContrastRatio(whiteFg, newHex);
    
    if (ratio >= targetRatio) {
      console.log(`✓ Found: ${newHex} (ratio: ${ratio.toFixed(2)}:1)`);
      console.log(`  Darkness increase: ${(100 - factor * 100).toFixed(1)}%`);
      return newHex;
    }
  }
  
  return null;
}

// Run the search
console.log('================================================================================');
console.log('FINDING WCAG AA COMPLIANT COLORS');
console.log('================================================================================');

const newTextMuted = findCompliantTextMuted();
const newAccentPrimary = findCompliantAccentPrimary();

console.log('\n================================================================================');
console.log('SUMMARY');
console.log('================================================================================');
console.log('\nRecommended color updates:');
console.log(`\n1. text.muted: ${newTextMuted || 'Not found'}`);
console.log(`   (was: #737373)`);
console.log(`\n2. accent.primary: ${newAccentPrimary || 'Not found'}`);
console.log(`   (was: #3b82f6)`);
console.log('\n');
