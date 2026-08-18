import CheckoutPage from '../2_Pages/8_CheckoutPage';
import PaymentPage from '../2_Pages/9_PaymentPage';
import { test as base } from '../5_Fixtures/5_CartFixture';

type MyFixtures = {
  paymentFixture: PaymentPage;
};

export const test = base.extend<MyFixtures>({
  paymentFixture: async ({ page ,addProducts,}, use) => {
 const productsIndex = [1, 2, 8];
    const cart = await addProducts(productsIndex);
    await page.goto("/view_cart", { waitUntil: "domcontentloaded" });

    await cart.proccedToCheckoutBtnClick();

    const checkout = new CheckoutPage(page);
    await checkout.placeOrderClick()


    const paymentFixture = new PaymentPage(page);
    // await page.goto('/payment', { waitUntil: 'domcontentloaded' });
    await use(paymentFixture);
  },
});

export { expect } from '@playwright/test';
