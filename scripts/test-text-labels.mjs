import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

// Enable console logging
page.on('console', msg => console.log('CONSOLE:', msg.text()));

console.log('Navigating to app...');
await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

// Wait for 3D model to load
console.log('Waiting for 3D canvas...');
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(3000);

console.log('Adding text label "TEST" on Front...');

// Type text in the input field
await page.type('input[placeholder="Enter text..."]', 'TEST');

// Click the "Add Label" button
await page.click('button:has-text("Add Label")');

console.log('Waiting for text to render...');
await page.waitForTimeout(2000);

// Take screenshot
console.log('Taking screenshot...');
await page.screenshot({
  path: 'screenshots/text-label-test.png',
  fullPage: false
});

console.log('Adding second label "BACK" on Back...');

// Click the "Back" button
await page.click('button:has-text("Back")');
await page.waitForTimeout(500);

// Type second text
await page.type('input[placeholder="Enter text..."]', 'BACK');

// Click "Add Label" again
await page.click('button:has-text("Add Label")');

await page.waitForTimeout(2000);

// Take final screenshot
console.log('Taking final screenshot...');
await page.screenshot({
  path: 'screenshots/text-labels-both.png',
  fullPage: false
});

console.log('Screenshots saved!');
console.log('- screenshots/text-label-test.png (with "TEST" on front)');
console.log('- screenshots/text-labels-both.png (with both labels)');

await browser.close();
