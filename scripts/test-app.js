import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Capture console messages
  page.on('console', msg => {
    console.log('BROWSER CONSOLE:', msg.text());
  });

  // Navigate to app
  console.log('Opening http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // Wait for model to load
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('\n=== Testing Color Zones ===\n');

  // Take screenshot of initial state
  await page.screenshot({ path: 'screenshots/initial.png' });
  console.log('Screenshot saved: screenshots/initial.png');

  // Wait a bit more to see console logs
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('\nTest complete!');

  // Keep browser open for manual inspection
  console.log('\nBrowser will stay open for 30 seconds...');
  await new Promise(resolve => setTimeout(resolve, 30000));

  await browser.close();
})();
