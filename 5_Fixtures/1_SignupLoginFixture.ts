import { test as base, Page } from '@playwright/test';
import MainPage from '../2_Pages/1_MainPage';

export const test = base.extend<{ mainPage: MainPage }>({
  mainPage: async ({ page}, use) => {
   
      await Promise.all([
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    ]);

    const mainPage = new MainPage(page);
    await mainPage.signupLoginBottunClick();
    await use(mainPage);    

   },
});

export { expect } from '@playwright/test';