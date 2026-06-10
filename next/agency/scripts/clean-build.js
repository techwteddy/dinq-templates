#!/usr/bin/env node

/**
 * Script to clean build artifacts and caches
 */

const fs = require('fs');
const path = require('path');

const foldersToClean = [
  '.next',
  '.swc',
  'node_modules/.cache',
  'coverage',
  '.turbo',
];

console.log('🧹 Cleaning build artifacts and caches...\n');

foldersToClean.forEach(folder => {
  const folderPath = path.join(__dirname, '..', folder);
  
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log(`✅ Removed: ${folder}/`);
  } else {
    console.log(`⏭️  Skipped: ${folder}/ (doesn't exist)`);
  }
});

console.log('\n✨ Clean complete!\n');
