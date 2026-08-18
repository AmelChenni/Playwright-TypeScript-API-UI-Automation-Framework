import OrderConfirmation from '../2_Pages/10_OrderConfirmationPage';
import { test as base } from '../5_Fixtures/6_PaymentFixtures';

type MyFixtures = {
  confirmationFixture: any;
};

export const test = base.extend<MyFixtures>({
  confirmationFixture: async ({ page ,paymentFixture,}, use) => {

    await paymentFixture.payAndConfirm("amel","123456789","123","20","2025")
    const confirmationFixture = new OrderConfirmation(page);
    await use(confirmationFixture);
  },
});

export { expect } from '@playwright/test';
