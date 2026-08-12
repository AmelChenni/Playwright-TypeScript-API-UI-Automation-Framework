import { test as base } from '@playwright/test';
import CartPage from '../2_Pages/7_CartPage';

type MyFixtures = {
  cartEmpty: any;
};

export const test = base.extend<MyFixtures>({
  cartEmpty: async ({ page }, use) => {

    const cartEmpty = new CartPage(page);
    await page.goto('/view_cart', { waitUntil: 'domcontentloaded' });
    await use(cartEmpty);
  },
});

export { expect } from '@playwright/test';
