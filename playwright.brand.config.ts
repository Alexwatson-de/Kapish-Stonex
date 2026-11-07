import { defineConfig, devices } from '@playwright/test';

// Read-only checks can target the optimized local build or the deployed website.
// No synthetic accounts, uploads or live catalogue mutations are made.
export default defineConfig({
  testDir: './brand-tests',
  workers: 1,
  fullyParallel: false,
  timeout: 180000,
  expect: { timeout: 15000 },
  reporter: [['list']],
  outputDir: 'test-results/brand',
  use: {
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], launchOptions: { args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] } } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
