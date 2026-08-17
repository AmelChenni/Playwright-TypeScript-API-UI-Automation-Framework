import {expect, test } from '../5_Fixtures/4_EmptyCartFxture'

test.describe("Empty Cart", () => {

  test(" Empty Cart - Initial State", { tag: '@auth' }, async ({page,cartEmpty}) => {
   
    // const cartPage =  new CartPage(page);
    await expect(page).toHaveURL(/view_cart/);
    await expect(cartEmpty.emptyCart).toBeVisible()
    await expect(cartEmpty.emptyCart).toContainText('Cart is empty!')
    // click here
    await cartEmpty.buyProductsBtnClick();
     await expect(page).toHaveURL(/products/);
  });
   test(" Empty Cart - Navigation to Products", { tag: '@auth' }, async ({page,cartEmpty}) => {
    await cartEmpty.buyProductsBtnClick();    
     await expect(page).toHaveURL(/products/);
  });
     test(" Empty Cart - Navigation to Home", { tag: '@auth' }, async ({page,cartEmpty}) => {
    await cartEmpty.homeBtnClick();    
     await expect(page).toHaveURL('/');

    
  });


});

// test('Cleanup - Delete User Account', { tag: ['@auth', '@cleanup'] }, async ({ page }) => {
//   await page.goto('/', { waitUntil: 'domcontentloaded' });
//   const products = new Products(page);
//   await products.deleteAccountClick();
//   await expect(page.getByText('Account Deleted!')).toBeVisible();
// });

