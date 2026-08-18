import CartPage from "../2_Pages/7_CartPage";
import { expect, test } from "../5_Fixtures/7_OrderConfirmationFixture";
test.beforeEach(async ({ page }) => {
  await page.route("**/*google*ads***", (route) => route.abort());
  await page.route("**/*doubleclick***", (route) => route.abort());
  //   await page.goto("/products");
});

test.describe("Order Confirmation Tests",()=>{
    test.describe.configure({ mode: "serial" });
    
    test('Order Confirmation - Success Message Displayed ',{ tag: "@auth" }, async({confirmationFixture,page}) => {
      await expect(await confirmationFixture.title).toHaveText('Order Placed!')
      await expect(await confirmationFixture.text).toHaveText('Congratulations! Your order has been confirmed!')
    })

      test('Order Confirmation - Download Invoice Button Visible',{ tag: "@auth" }, async({confirmationFixture,page}) => {
      await expect(await confirmationFixture.download).toBeVisible()
      await expect(await confirmationFixture.download).toBeEnabled();  
        // Download Even
        const [download] = await Promise.all([
        page.waitForEvent('download'),
        confirmationFixture.downloadClick()
        
            ]);
        // Filename & Extension
        const fileName = download.suggestedFilename();        
         expect(fileName).toContain('invoice.txt');

    })
    test('Order Confirmation - Continue Button Redirects Home',{ tag: "@auth" }, async({confirmationFixture,page}) => {
      await expect(await confirmationFixture.continue).toBeVisible()
      await expect(await confirmationFixture.continue).toBeEnabled();  
    //   click
    await confirmationFixture.continueClick()
    await expect(page).toHaveURL("/")
        

    })
      test('Order Confirmation - Cart Is Empty After Successful Order',{ tag: "@auth" }, async({confirmationFixture,page}) => {
    await confirmationFixture.continueClick()
    // cart page
    const cart =  new CartPage(page)
     await page.goto('/view_cart');
     await expect(cart.emptyCart).toHaveText(/.*Cart is empty! Click here to buy products.*/)
    })
    
})

