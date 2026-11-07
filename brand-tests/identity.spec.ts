import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const routes = ['/', '/collection', '/studio', '/compare', '/contact', '/privacy', '/terms', '/admin'];
test.beforeEach(async ({ page }) => {
  // A visual rebrand check must never create or change real customer records.
  await page.route('**/api/**', async (route) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(route.request().method())) await route.continue();
    else await route.abort('blockedbyclient');
  });
});

test('new brand and emblem appear on every public page and staff sign-in', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator('#main')).toBeVisible();
    await expect(page).toHaveTitle(/Kapish Stonex/);
    await expect(page.locator('.wordmark').first()).toHaveAccessibleName('Kapish Stonex home');
    await expect(page.locator('.brand-name').first()).toHaveText('Kapish');
    await expect(page.locator('.brand-descriptor').first()).toHaveText('Stonex');
    const emblem = page.locator('.brand-emblem').first();
    await expect(emblem).toBeVisible();
    expect(await emblem.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    expect(await page.locator('body').innerText()).not.toMatch(/stillvein/i);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.locator('.brand-name').first().evaluate((el) => getComputedStyle(el).fontFamily)).toContain('Atlas Serif');
    // Let RSC prefetch settle before a full navigation, rather than generating
    // WebKit cancellation errors from intentionally abandoned requests.
    await page.waitForLoadState('networkidle');
  }
  expect(errors).toEqual([]);
});

test('brand stays readable and unclipped on phones, tablets and desktop', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await mkdir('artifacts/qa/kapish-stonex', { recursive: true });
  for (const width of [320, 360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    for (const route of ['/', '/collection', '/contact', '/admin']) {
      await page.goto(route);
      await expect(page.locator('.brand-name').first()).toHaveText('Kapish');
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const mark = await page.locator('.wordmark').first().boundingBox();
      expect(mark!.x).toBeGreaterThanOrEqual(0);
      expect(mark!.x + mark!.width).toBeLessThanOrEqual(width);
    }
    if (width === 390 || width === 1440) {
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `artifacts/qa/kapish-stonex/${testInfo.project.name}-${width}-home.png`, fullPage: false });
      await page.locator('footer').screenshot({ path: `artifacts/qa/kapish-stonex/${testInfo.project.name}-${width}-footer.png` });
    }
  }
});

test('page metadata, favicon and share assets use Kapish Stonex', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content', 'Kapish Stonex');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/brand\/social-card.png$/);
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', /Kapish Stonex/);
  for (const path of ['/brand/hanuman-emblem.svg', '/brand/favicon.svg', '/brand/social-card.png', '/brand/apple-touch-icon.png']) {
    const r = await request.get(path);
    expect(r.ok()).toBe(true);
    expect(r.headers()['content-type']).toMatch(/image\//);
  }
  const settings = await request.get('/api/settings');
  expect((await settings.json()).brand).toBe('Kapish Stonex');
});

test('existing visitor comparison selections migrate and still resolve materials', async ({ page, request }) => {
  const catalog = await request.get('/api/catalog?limit=1');
  expect(catalog.ok()).toBe(true);
  const data = await catalog.json();
  const product = data.products[0];
  expect(product).toBeTruthy();
  await page.goto('/');
  await page.evaluate((id) => {
    localStorage.removeItem('kapish-stonex.compare');
    localStorage.setItem('stillvein.compare', JSON.stringify([id]));
  }, product.id);
  await page.goto('/compare');
  await expect(page.getByRole('heading', { name: product.name, exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('stillvein.compare'))).toBeNull();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('kapish-stonex.compare') || '[]'))).toEqual([product.id]);
  await page.getByRole('button', { name: 'Remove from comparison' }).click();
  await expect(page.getByRole('heading', { name: 'Give your ideas some company.' })).toBeVisible();
});
