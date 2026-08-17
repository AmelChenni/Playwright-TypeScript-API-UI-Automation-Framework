import { test as base, expect } from '@playwright/test';
import Products from '../2_Pages/6_ProductsPage';
import CartPage from '../2_Pages/7_CartPage'; 

type MyFixtures = {
  addProducts: (productIds: number[]) => Promise<CartPage>;
};

export const test = base.extend<MyFixtures>({
  addProducts: async ({ page }, use) => {
    const productsPage = new Products(page);

    const addProducts = async (productIds: number[]) => {
await page.goto('/products', { waitUntil: 'domcontentloaded' });
await page.waitForLoadState('domcontentloaded');
      // const productsId = [0];

      for (const id of productIds) {
        await productsPage.addToCartProductClick(id);
        await productsPage.continueShoppingClick();
      }
      await productsPage.modelContent.waitFor({ state: 'hidden' });
      
      // await page.goto('/view_cart', { waitUntil: 'domcontentloaded' });

      return new CartPage(page);
    };

    await use(addProducts);
    // clean
    // await productsPage.deleteAccountClick();
    // await expect(page.getByText('Account Deleted!')).toBeVisible();
  },
});

export { expect } from '@playwright/test';