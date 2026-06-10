/**
 * Color Contrast Audit Script
 * Audits all color combinations in the design for WCAG AA compliance
 */

import { auditColorCombinations, colorPalette } from '../lib/color-contrast';

console.log('='.repeat(80));
console.log('COLOR CONTRAST AUDIT - WCAG AA Compliance');
console.log('='.repeat(80));
console.log('\nStandards:');
console.log('  - Normal text (< 18px or < 14px bold): 4.5:1 minimum');
console.log('  - Large text (≥ 18px or ≥ 14px bold): 3:1 minimum');
console.log('\n');

const results = auditColorCombinations();

// Group by pass/fail
const passing = results.filter((r) => r.passes);
const failing = results.filter((r) => !r.passes);

console.log(`SUMMARY: ${passing.length} passing, ${failing.length} failing\n`);

if (failing.length > 0) {
  console.log('❌ FAILING COMBINATIONS:\n');
  failing.forEach((result) => {
    console.log(`${result.status} ${result.name}`);
    console.log(`   Foreground: ${result.fg}`);
    console.log(`   Background: ${result.bg}`);
    console.log(`   Ratio: ${result.ratio}:1 (Required: ${result.required}:1)`);
    console.log(`   Gap: ${(result.required - result.ratio).toFixed(2)}:1 below minimum\n`);
  });
}

if (passing.length > 0) {
  console.log('✅ PASSING COMBINATIONS:\n');
  passing.forEach((result) => {
    console.log(`${result.status} ${result.name}`);
    console.log(`   Ratio: ${result.ratio}:1 (Required: ${result.required}:1)\n`);
  });
}

console.log('='.repeat(80));
console.log('COLOR PALETTE REFERENCE:');
console.log('='.repeat(80));
console.log('\nDark backgrounds:');
console.log(`  - dark.DEFAULT: ${colorPalette.dark.DEFAULT}`);
console.log(`  - dark.lighter: ${colorPalette.dark.lighter}`);
console.log(`  - dark.card: ${colorPalette.dark.card}`);
console.log('\nText colors:');
console.log(`  - text.primary (white): ${colorPalette.text.primary}`);
console.log(`  - text.secondary: ${colorPalette.text.secondary}`);
console.log(`  - text.muted: ${colorPalette.text.muted}`);
console.log('\nAccent colors:');
console.log(`  - accent.primary: ${colorPalette.accent.primary}`);
console.log(`  - accent.secondary: ${colorPalette.accent.secondary}`);
console.log(`  - accent.hover: ${colorPalette.accent.hover}`);
console.log('\n');

// Recommendations
if (failing.length > 0) {
  console.log('='.repeat(80));
  console.log('RECOMMENDATIONS:');
  console.log('='.repeat(80));
  console.log('\n1. Replace gray-300 (#d1d5db) with lighter shades for better contrast');
  console.log('2. Replace gray-400 (#9ca3af) with lighter shades for better contrast');
  console.log('3. Consider using text-secondary (#a3a3a3) or lighter for muted text');
  console.log('4. Ensure all body text uses white (#ffffff) on dark backgrounds');
  console.log('5. Test accent colors against dark backgrounds\n');
}
