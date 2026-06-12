import fs from 'fs-extra';
import path from 'path';

async function clearCache() {
  const dirs = ['.next', '.turbopack', 'dist'];
  
  for (const dir of dirs) {
    const fullPath = path.join(process.cwd(), dir);
    try {
      await fs.remove(fullPath);
      console.log(`[v0] Cleared ${dir}`);
    } catch (err) {
      console.log(`[v0] ${dir} not found or already cleared`);
    }
  }
  
  console.log('[v0] Cache cleared successfully');
}

clearCache();
