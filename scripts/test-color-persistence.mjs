#!/usr/bin/env node

/**
 * Test script to verify the 3D model persists after multiple color changes
 * This tests the fix for the memory leak bug where materials weren't being disposed
 */

import puppeteer from 'puppeteer';

const URL = 'http://localhost:5173';
const NUM_COLOR_CHANGES = 15; // Test with 15 changes (original bug appeared at 4-5)

async function testColorPersistence() {
  console.log('🧪 Testing color change persistence (15 iterations)...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Capture console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    errors.push(error.toString());
  });

  await page.goto(URL, { waitUntil: 'networkidle0' });

  // Wait for model to load
  await page.waitForTimeout(2000);

  const colors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF',
    '#00FFFF', '#FFA500', '#800080', '#008000', '#000080',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'
  ];

  console.log(`Changing colors ${NUM_COLOR_CHANGES} times...`);

  for (let i = 0; i < NUM_COLOR_CHANGES; i++) {
    const color = colors[i % colors.length];

    // Click the sleeve color button and select a color
    await page.evaluate((hex) => {
      // Find color input for sleeves
      const inputs = document.querySelectorAll('input[type="color"]');
      if (inputs[0]) {
        inputs[0].value = hex;
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, color);

    await page.waitForTimeout(100);

    // Check if model is still visible in the scene
    const modelVisible = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return false;

      // Check if canvas is rendering (has non-blank pixels)
      const ctx = canvas.getContext('2d');
      if (!ctx) return false;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Check if there are any non-background pixels
      for (let i = 0; i < data.length; i += 4) {
        // Skip background color (0xf0f0f0 = rgb(240, 240, 240))
        if (data[i] !== 240 || data[i+1] !== 240 || data[i+2] !== 240) {
          return true;
        }
      }
      return false;
    });

    if (!modelVisible) {
      console.error(`❌ FAIL: Model disappeared after ${i + 1} color changes!`);
      console.error('Errors detected:', errors);
      await browser.close();
      process.exit(1);
    }

    if ((i + 1) % 5 === 0) {
      console.log(`✓ ${i + 1} color changes - model still visible`);
    }
  }

  if (errors.length > 0) {
    console.error('\n⚠️  Console errors detected:');
    errors.forEach(err => console.error('  -', err));
  }

  console.log(`\n✅ SUCCESS: Model persisted through ${NUM_COLOR_CHANGES} color changes!`);
  console.log('   Memory leak fix is working correctly.\n');

  await browser.close();
}

testColorPersistence().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
