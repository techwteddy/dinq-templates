#!/usr/bin/env node

/**
 * Script to organize components into logical folders
 * Structure:
 * - components/
 *   - ui/          (reusable UI components)
 *   - sections/    (page sections)
 *   - forms/       (form components)
 *   - layout/      (layout components)
 */

const fs = require('fs');
const path = require('path');

const organization = {
  ui: [
    'button.tsx',
    'card.tsx',
    'heading.tsx',
    'divider.tsx',
    'magnetic.tsx',
    'theme-switch.tsx',
  ],
  sections: [
    'hero.tsx',
    'about.tsx',
    'services.tsx',
    'service.tsx',
    'projects.tsx',
    'project.tsx',
    'packages.tsx',
    'package.tsx',
    'package-card.tsx',
    'differentiators.tsx',
    'differentiator.tsx',
    'testimonials.tsx',
    'testimonial.tsx',
    'reviews.tsx',
    'review.tsx',
    'intro.tsx',
  ],
  forms: [
    'contact.tsx',
    'contact-form.tsx',
    'submit-btn.tsx',
  ],
  layout: [
    'header.tsx',
    'footer.tsx',
  ],
  dialogs: [
    'become-a-client.tsx',
    'comparison-dialog.tsx',
    'privacy-policy.tsx',
    'terms-and-conditions.tsx',
  ],
};

console.log('📁 Organizing components into folders...\n');

const componentsDir = path.join(__dirname, '..', 'components');

// Create folders
Object.keys(organization).forEach(folder => {
  const folderPath = path.join(componentsDir, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`✅ Created folder: components/${folder}/`);
  }
});

// Move files
Object.entries(organization).forEach(([folder, files]) => {
  files.forEach(file => {
    const fromPath = path.join(componentsDir, file);
    const toPath = path.join(componentsDir, folder, file);
    
    if (fs.existsSync(fromPath)) {
      fs.renameSync(fromPath, toPath);
      console.log(`✅ Moved: ${file} → ${folder}/${file}`);
    }
  });
});

console.log('\n✨ Component organization complete!\n');
console.log('⚠️  Note: You\'ll need to update imports manually or run the update-imports script\n');
