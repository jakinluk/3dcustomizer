import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 900 });

page.on('console', msg => console.log('CONSOLE:', msg.text()));

await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
await new Promise(resolve => setTimeout(resolve, 4000));

await page.screenshot({ path: 'screenshots/current-state.png', fullPage: true });
console.log('Screenshot saved to screenshots/current-state.png');

await new Promise(resolve => setTimeout(resolve, 2000));
await browser.close();
