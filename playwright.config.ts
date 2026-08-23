import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './1_tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: 'html',
  reporter: [
    ['line'],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://automationexercise.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
        testIdAttribute: 'data-qa',
        headless: !!process.env.CI ? true : false,

  },


  /* Configure projects for major browsers */
projects: [
  // 1. Setup Project
  {
    name: 'setup',
    testMatch: /global\.setup\.ts/,
  },

  // --- CHROMIUM ---
  {
    name: 'chromium-unauth',
    use: { ...devices['Desktop Chrome'] },
    grepInvert: /@auth/,  
  },
  {
    name: 'chromium-auth',
    use: {
      ...devices['Desktop Chrome'],
      storageState: 'playwright/.auth/user.json',
    },
    grep: /@auth/,         
    dependencies: ['setup'],
  },


  // --- FIREFOX ---
  // {
  //   name: 'firefox-unauth',
  //   use: { ...devices['Desktop Firefox'] },
  //   grepInvert: /@auth/,
  //   testIgnore: /.*Cart.*|.*Checkout.*/,
  // },
  // {
  //   name: 'firefox-auth',
  //   use: {
  //     ...devices['Desktop Firefox'],
  //     storageState: 'playwright/.auth/user.json',
  //   },
  //   grep: /@auth/,
  //   testMatch: /.*Cart.*|.*Checkout.*/,
  //   dependencies: ['setup'],
  // },

  // --- WEBKIT (SAFARI) ---
  // {
  //   name: 'webkit-unauth',
  //   use: { ...devices['Desktop Safari'] },
  //   grepInvert: /@auth/,
  //   testIgnore: /.*Cart.*|.*Checkout.*/,
  // },
  // {
  //   name: 'webkit-auth',
  //   use: {
  //     ...devices['Desktop Safari'],
  //     storageState: 'playwright/.auth/user.json',
  //   },
  //   grep: /@auth/,
  //   testMatch: /.*Cart.*|.*Checkout.*/,
  //   dependencies: ['setup'],
  // },


    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
