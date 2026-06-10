#!/usr/bin/env node

/**
 * Script to rename PascalCase components to kebab-case
 * and update all imports across the codebase
 */

const fs = require('fs');
const path = require('path');

const renames = [
  { from: 'Hero.tsx', to: 'hero.tsx' },
  { from: 'Button.tsx', to: 'button.tsx' },
  { from: 'Card.tsx', to: 'card.tsx' },
  { from: 'ContactForm.tsx', to: 'contact-form.tsx' },
  { from: 'Differentiator.tsx', to: 'differentiator.tsx' },
];

const importUpdates = [
  { from: '/Hero', to: '/hero' },
  { from: '/Button', to: '/button' },
  { from: '/Card', to: '/card' },
  { from: '/ContactForm', to: '/contact-form' },
  { from: '/Differentiator', to: '/differentiator' },
];

console.log('🔄 Renaming components to kebab-case...\n');

// Rename files
renames.forEach(({ from, to }) => {
  const fromPath = path.join(__dirname, '..', 'components', from);
  const toPath = path.join(__dirname, '..', 'components', to);
  
  if (fs.existsSync(fromPath)) {
    fs.renameSync(fromPath, toPath);
    console.log(`✅ Renamed: ${from} → ${to}`);
  }
});

console.log('\n📝 Updating imports...\n');

// Update imports in all TypeScript files
function updateImports(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    const filePath = path.join(dir, file.name);
    
    if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
      updateImports(filePath);
    } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let updated = false;
      
      importUpdates.forEach(({ from, to }) => {
        const regex = new RegExp(from + '([\'"])', 'g');
        if (regex.test(content)) {
          content = content.replace(regex, to + '$1');
          updated = true;
        }
      });
      
      if (updated) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated imports in: ${path.relative(process.cwd(), filePath)}`);
      }
    }
  });
}

updateImports(path.join(__dirname, '..'));

console.log('\n✨ Component renaming complete!\n');
