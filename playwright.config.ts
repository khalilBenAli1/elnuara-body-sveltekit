import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 2,
  reporter: 'list',
  use: {
    baseURL:
      process.env.DEMO_URL ?? 'http://127.0.0.1:4206/elnuara-body-sveltekit/',
    trace: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ],
  webServer: process.env.DEMO_URL
    ? undefined
    : {
        command: 'npm run preview',
        url: 'http://127.0.0.1:4206/elnuara-body-sveltekit/',
        reuseExistingServer: !process.env.CI
      }
});
