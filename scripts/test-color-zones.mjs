import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  // Capture console
  page.on('console', msg => console.log('CONSOLE:', msg.text()));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await page.waitForTimeout(3000);

  // Screenshot 1: Initial state (White sleeves, Blue front/back)
  await page.screenshot({ path: 'screenshots/test1-initial.png', fullPage: true });
  console.log('Screenshot 1: Initial state');

  await page.waitForTimeout(1000);

  // Screenshot 2: Click Red for sleeves
  const sleeveRed = await page.$('div:has(label:text("Sleeve Color")) + div button[style*="rgb(220, 53, 69)"]');
  if (sleeveRed) {
    await sleeveRed.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/test2-red-sleeves.png', fullPage: true });
    console.log('Screenshot 2: Red sleeves clicked');
  }

  // Screenshot 3: Click Green for front
  const frontGreen = await page.$$('div:has(label:text("Front Color")) + div button[style*="rgb(40, 167, 69)"]');
  if (frontGreen[0]) {
    await frontGreen[0].click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/test3-green-front.png', fullPage: true });
    console.log('Screenshot 3: Green front clicked');
  }

  // Screenshot 4: Click Yellow for back
  const backYellow = await page.$$('div:has(label:text("Back Color")) + div button[style*="rgb(255, 193, 7)"]');
  if (backYellow[0]) {
    await backYellow[0].click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/test4-yellow-back.png', fullPage: true });
    console.log('Screenshot 4: Yellow back clicked');
  }

  await page.waitForTimeout(2000);
  await browser.close();
  console.log('\nTest complete! Check screenshots/ folder');
})();
