import { test, expect } from '@playwright/test';

test('loads homepage and renders key cards', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await expect(page.locator('text=Monomorph Demo')).toBeVisible();
  await expect(page.locator('text=Fair Value Forecaster')).toBeVisible();
  await expect(page.locator('text=Dividend Crystal Ball')).toBeVisible();
  await expect(page.locator('text=Rebalance Optimizer')).toBeVisible();
  await expect(page.locator('text=ETF Comparator')).toBeVisible();
  await expect(page.locator('text=Portfolio Leaderboard')).toBeVisible();
  await expect(page.locator('text=Candlestick Hero')).toBeVisible();
  await expect(page.locator('text=Pattern Matcher')).toBeVisible();
});

test('candlestick toggles work', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  const ma = page.getByLabel('MA20/MA50');
  const bb = page.getByLabel('Bollinger Bands');
  const rsi = page.getByLabel('RSI');
  await ma.check();
  await bb.check();
  await rsi.check();
  await expect(page.locator('text=RSI (14):')).toBeVisible();
});
