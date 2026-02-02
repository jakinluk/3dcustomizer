import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 900 });

await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
await new Promise(resolve => setTimeout(resolve, 4000));

console.log('Taking screenshots from different angles...');

// Initial view
await page.screenshot({ path: 'screenshots/angle-initial.png' });
console.log('1. Initial angle');

await new Promise(resolve => setTimeout(resolve, 1000));

// Click Front view button
try {
  await page.click('button:has-text("Front")');
  await new Promise(resolve => setTimeout(resolve, 800));
  await page.screenshot({ path: 'screenshots/angle-front.png' });
  console.log('2. Front view (should be GREEN)');
} catch(e) { console.log('Front button not found'); }

// Click Back view button
try {
  await page.click('button:has-text("Back")');
  await new Promise(resolve => setTimeout(resolve, 800));
  await page.screenshot({ path: 'screenshots/angle-back.png' });
  console.log('3. Back view (should be YELLOW)');
} catch(e) { console.log('Back button not found'); }

// Click Left view button
try {
  await page.click('button:has-text("Left")');
  await new Promise(resolve => setTimeout(resolve, 800));
  await page.screenshot({ path: 'screenshots/angle-left.png' });
  console.log('4. Left view (should show RED sleeve)');
} catch(e) { console.log('Left button not found'); }

// Click Right view button
try {
  await page.click('button:has-text("Right")');
  await new Promise(resolve => setTimeout(resolve, 800));
  await page.screenshot({ path: 'screenshots/angle-right.png' });
  console.log('5. Right view (should show RED sleeve)');
} catch(e) { console.log('Right button not found'); }

console.log('\nScreenshots saved! Check screenshots/ folder');
await new Promise(resolve => setTimeout(resolve, 2000));
await browser.close();
