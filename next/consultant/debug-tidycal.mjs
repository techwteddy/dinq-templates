import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  console.log('Navigating to http://localhost:3001/contact...');
  await page.goto('http://localhost:3001/contact');
  
  await page.waitForTimeout(3000);
  
  await browser.close();
})();
