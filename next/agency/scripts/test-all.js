#!/usr/bin/env node

/**
 * Comprehensive test runner with better output
 */

const { execSync } = require('child_process');

console.log('🧪 Running comprehensive test suite...\n');

const tests = [
  {
    name: 'Unit Tests',
    command: 'npm test -- --passWithNoTests',
    emoji: '🔬',
  },
  {
    name: 'Type Check',
    command: 'npx tsc --noEmit',
    emoji: '📘',
  },
  {
    name: 'Lint Check',
    command: 'npm run lint',
    emoji: '🔍',
  },
  {
    name: 'Format Check',
    command: 'npm run format:check',
    emoji: '💅',
  },
];

let allPassed = true;

tests.forEach(({ name, command, emoji }) => {
  console.log(`${emoji} Running ${name}...`);
  
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${name} passed\n`);
  } catch (error) {
    console.log(`❌ ${name} failed\n`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('✨ All tests passed! 🎉\n');
  process.exit(0);
} else {
  console.log('❌ Some tests failed. Please fix the issues above.\n');
  process.exit(1);
}
