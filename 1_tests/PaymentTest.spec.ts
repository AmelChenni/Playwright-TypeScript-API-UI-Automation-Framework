import { expect, test } from "../5_Fixtures/6_PaymentFixtures";
test.beforeEach(async ({ page }) => {
  await page.route("**/*google*ads***", (route) => route.abort());
  await page.route("**/*doubleclick***", (route) => route.abort());
  //   await page.goto("/products");
});

test.describe("Payment Page Rendering Test", () => {
    test(`Payment Page - Basic Rendering -`, { tag: "@auth" }, async ({page, paymentFixture }) => {

      await expect(paymentFixture.nameInput).toBeVisible()
      await expect(paymentFixture.cardNumberInput).toBeVisible()
      await expect(paymentFixture.cvcInput).toBeVisible()
      await expect(paymentFixture.expYearInput).toBeVisible()
      await expect(paymentFixture.expMonthInput).toBeVisible()
      await expect(paymentFixture.submitBtn).toBeVisible()
      await expect(paymentFixture.heading).toBeVisible();
// await expect(paymentFixture.paymentForm).toBeVisible();


    });
});

const cardDataInvalid = [
  { title: "Empty fields", name: "", cardNumber: "", cvc: "", exp: "", year: "", getInput: (p) => p.nameInput },
  { title: "Empty name field", name: "", cardNumber: "142536789", cvc: "123", exp: "12", year: "2028", getInput: (p) => p.nameInput },
  { title: "Empty card number field",  name: "amel", cardNumber: "", cvc: "123", exp: "12", year: "2028", getInput: (p) => p.cardNumberInput },
  { title: "Empty cvc field", name: "amel", cardNumber: "4111111111111111", cvc: "", exp: "12", year: "2028", getInput: (p) => p.cvcInput },
  { title: "Empty exp field", name: "amel", cardNumber: "4111111111111111", cvc: "0", exp: "", year: "2028", getInput: (p) => p.expMonthInput },
  { title: "Empty year field", name: "amel", cardNumber: "4111111111111111", cvc: "0", exp: "12", year: "", getInput: (p) => p.expYearInput },
];


test.describe("Payment Page - Validation Findings", () => {
  for (const data of cardDataInvalid) {
    test(`Payment - HTML Validation - ${data.title}`, { tag: "@auth" }, async ({page, paymentFixture }) => {
      await paymentFixture.payAndConfirm(data.name, data.cardNumber, data.cvc, data.exp, data.year);
      // await paymentFixture.submitClick()
      const validationMessage = await paymentFixture.getHTMLValidationError(data.getInput(paymentFixture));
      expect(validationMessage.length).toBeGreaterThan(0);
      await expect(validationMessage).toContain('Please fill out this field.')
      await page.goto('/payment', { waitUntil: 'domcontentloaded' });


    });
  }
});


const cardDataValid = [
  { title: "All information correct ", name: "amel", cardNumber: "123456789", cvc: "123", exp: "12", year: "2050" },
  { title: " Invalid name Format(number) ", name: "142536", cardNumber: "abcd", cvc: "123", exp: "12", year: "2050" },
  { title: " Invalid Card Number Format(string) ", name: "amel", cardNumber: "abcd", cvc: "123", exp: "12", year: "2050" },
{ title: "Short card number",  name: "amel", cardNumber: "1425", cvc: "123", exp: "12", year: "2028" },
{ title: "long card number",  name: "amel", cardNumber: "1414253614253614253625", cvc: "123", exp: "12", year: "2028" },
  { title: "Invalid CVC format(number)", name: "amel", cardNumber: "4111111111111111", cvc: "0", exp: "12" , year: "2028"},
  { title: "Invalid CVC format(string)", name: "amel", cardNumber: "4111111111111111", cvc: "abc", exp: "12" , year: "2028"},
  { title: "Invalid EXP format(number)", name: "amel", cardNumber: "142536789", cvc: "0", exp: "0" , year: "2028"},
  { title: "Invalid EXP format(string)", name: "amel", cardNumber: "142536789", cvc: "0", exp: "abcd" , year: "2028"},
  { title: "Invalid Year format(number)", name: "amel", cardNumber: "142536789", cvc: "0", exp: "0" , year: "0"},
  { title: "Invalid Year format(string)", name: "amel", cardNumber: "142536789", cvc: "0", exp: "0" , year: "abcd"},
];

test.describe("Payment Page - Validation Findings - Format Handling", () => {
  for (const data of cardDataValid) {
    test(`Payment - - ${data.title}`, { tag: "@auth" }, async ({page, paymentFixture }) => {
      // to catch the alert success
      // await page.route('**/payment_done**', route => route.abort());
      await paymentFixture.payAndConfirm(data.name, data.cardNumber, data.cvc, data.exp, data.year);
      // await paymentFixture.submitClick()
      // console.log((await paymentFixture.getAlertSuccess()));
            

      
            // await page.unroute('**/payment_done**');

  // await paymentFixture.submitBtn.click();
      await expect(page).toHaveURL(/.*payment_done.*/)
      // await expect(paymentFixture.alertSuccess).toHaveText("You have been successfully subscribed!")
      
      // await page.goto('/payment', { waitUntil: 'domcontentloaded' });
      
      // await expect(page.title()).toContain("")



    });
  }
});