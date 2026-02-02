import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 900 });

await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
await new Promise(resolve => setTimeout(resolve, 4000));

console.log('Capturing rotated views...');

// Get canvas element
const canvas = await page.$('canvas');
const box = await canvas.boundingBox();

// View 1: Initial
await page.screenshot({ path: 'screenshots/rotate-view1.png' });
console.log('View 1: Initial');
await new Promise(resolve => setTimeout(resolve, 500));

// View 2: Rotate left (drag right)
await page.mouse.move(box.x + box.width/2, box.y + box.height/2);
await page.mouse.down();
await page.mouse.move(box.x + box.width*0.7, box.y + box.height/2, { steps: 20 });
await page.mouse.up();
await new Promise(resolve => setTimeout(resolve, 500));
await page.screenshot({ path: 'screenshots/rotate-view2-left.png' });
console.log('View 2: Rotated left (should see right sleeve - RED)');

// View 3: Rotate more
await page.mouse.move(box.x + box.width/2, box.y + box.height/2);
await page.mouse.down();
await page.mouse.move(box.x + box.width*0.8, box.y + box.height/2, { steps: 20 });
await page.mouse.up();
await new Promise(resolve => setTimeout(resolve, 500));
await page.screenshot({ path: 'screenshots/rotate-view3-more.png' });
console.log('View 3: Rotated more');

// View 4: Rotate to back
await page.mouse.move(box.x + box.width/2, box.y + box.height/2);
await page.mouse.down();
await page.mouse.move(box.x + box.width*0.9, box.y + box.height/2, { steps: 20 });
await page.mouse.up();
await new Promise(resolve => setTimeout(resolve, 500));
await page.screenshot({ path: 'screenshots/rotate-view4-back.png' });
console.log('View 4: Back view (should be YELLOW)');

console.log('\nAll views captured!');
await new Promise(resolve => setTimeout(resolve, 2000));
await browser.close();
