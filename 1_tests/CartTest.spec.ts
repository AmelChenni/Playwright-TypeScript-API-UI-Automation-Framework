import { beforeEach } from "node:test";
import Products from "../2_Pages/6_ProductsPage";
import CartPage from "../2_Pages/7_CartPage";
import { expect, test } from "../5_Fixtures/5_CartFixture";
import { priceStringToInt } from "../6_Utils/priceHelper";

test.beforeEach(async ({ page }) => {
  await page.route("**/*google*ads***", (route) => route.abort());
  await page.route("**/*doubleclick***", (route) => route.abort());
  //   await page.goto("/products");
});

test.describe("Cart Tests", () => {
  test.describe.configure({ mode: "serial" });
test.describe("UI & Layout Tests", () => {

  test(
    " Cart Page - Basic Rendering & Breadcrumbs",
    { tag: "@auth" },
    async ({ page, addProducts }) => {
     await page.goto("/products");
      const productsId = [0];
      await addProducts(productsId);
      await page.goto("/view_cart");
      await expect(page).toHaveURL(/view_cart/);
    },
  );

  test(
    "Cart Table Structure Verification",
    { tag: "@auth" },
    async ({ page, addProducts }) => {
        await page.goto("/products");
      const cartPage = await addProducts([1, 3]);
      await page.goto("/view_cart", { waitUntil: "domcontentloaded" });
      const details = await cartPage.getCartHeaders();
      expect(details.name).toContain("Item");
      expect(details.description).toContain("Description");
      expect(details.price).toContain("Price");
      expect(details.quantity).toContain("Quantity");
      expect(details.total).toContain("Total");
      expect(details.brand).toContain("");
    },
  );
});

test.describe("Data Integrity & Calculations", () => {

test.beforeEach(async({page})=>{
 // clean the cart
       const products = new Products(page);
 await page.goto('/view_cart');
  let contents = await products.getCartContent();  
 while (contents.length>0) {
   await products.deleteCartClick();  
  contents = await products.getCartContent()
 }
})
  test(
    "Cart Item - Details Matching",
    { tag: "@auth" },
    async ({ page, addProducts }) => {
      const productsIndex = [1, 8];

      //  get the product from products page
      const products = new Products(page);
      await page.goto("/products");
const expectedProducts: { name: string; price: string }[] = [];
for (const i of productsIndex) {
  const productInfo = await products.getProductInfo(i);
  expectedProducts.push({
    name: productInfo.name,
    price: productInfo.price,
  });
}

      // get the products table from  cart page
      const cartPage = await addProducts(productsIndex);
      await page.goto("/view_cart", { waitUntil: "domcontentloaded" });
      const cartBodyLenght = await cartPage.cartBodyLenght();

      const resultObject:{ name: string; price: string }[] = [];

      for (let i = 0; i < cartBodyLenght; i++) {
       resultObject.push({
        name :(await cartPage.getcartContent(i)).name,
        price :(await cartPage.getcartContent(i)).price,
       })
      }
      expect(resultObject).toEqual(expectedProducts);
    },
  );

  test(
    "Cart Item - Cart Overall Total Calculation",
    { tag: "@auth" },
    async ({ page, addProducts }) => {
      const productsIndex = [1, 8];
      let productTotal = 0;

      //  get the total from products pages
      await page.goto("/products");
      const products = new Products(page);
      for (const i of productsIndex) {
        const total = priceStringToInt(
          (await products.getProductInfo(i)).price,
        );
        productTotal = productTotal + total!;
      }

      // get the products table from  cart page
      const cartPage = await addProducts(productsIndex);
      await page.goto("/view_cart", { waitUntil: "domcontentloaded" });
      const cartBodyLenght = await cartPage.cartBodyLenght();

      let cartTotal = 0;

      for (let i = 0; i < cartBodyLenght; i++) {
        const total = priceStringToInt(
          (await cartPage.getcartContent(i)).total,
        );
        cartTotal = cartTotal + total!;
      }

      expect(productTotal).toEqual(cartTotal);
    },
  );

  test(
    "Cart Item - Total Price Calculation for one item",
    { tag: "@auth" },
    async ({ page }) => {
      // const productsIndex = [1]
      const quantityNumber = "5";
      // add one product
      const products = new Products(page);
      // change the quamtity
      await page.goto("/products");
      await products.viewProductDetailsClick(0);
      await products.quantityChange(quantityNumber);
      await products.addToCartProductDetailsClick();
      
      // get the total from cart page
      const cartPage = new CartPage(page);
      await page.goto("/view_cart", { waitUntil: "domcontentloaded" });
      const totalCart = priceStringToInt(
        (await cartPage.getcartContent(0)).total,
      );

      // expect total
      const expectTotal =
        priceStringToInt((await products.getProductCartDetails(0)).price)! *
        parseInt(quantityNumber);

      expect(totalCart).toEqual(expectTotal);
    },
  );

  test(
    "Cart Item - Total Price Calculation for more then item",
    { tag: "@auth" },
    async ({ page }) => {
      const productsIndex = [1, 2, 5, 8];
      const quantityNumber = "5";
      let totalCart: number[] = [];
      let totalProducts: number[] = [];
      // add  products
      const products = new Products(page);
      // change the quamtity
      for (const prod of productsIndex) {
        await page.goto("/products");

        await products.viewProductDetailsClick(prod);

        await products.quantityChange(quantityNumber);
        await products.addToCartProductDetailsClick();
      }

      // get the total from cart page
      const cartPage = new CartPage(page);
      await page.goto("/view_cart", { waitUntil: "domcontentloaded" });
      const cartBodyLenght = await cartPage.cartBodyLenght();


      for (let i = 0; i < cartBodyLenght; i++) {
        const price: number | null = priceStringToInt(
          (await cartPage.getcartContent(i)).total,
        );
        if (price !== null) {
          totalCart.push(price);
        }
      }

      // expect total
      for (let i = 0; i < cartBodyLenght; i++) {

        const price: number | null =
          priceStringToInt(
            await (
              await products.getProductCartDetails(i)
            ).price,
          )! * parseInt(quantityNumber);
        if (price !== null) {


          totalProducts.push(price);
        }
      }


      expect(totalCart).toEqual(totalProducts);
    },
  );

//   test('Cleanup - Delete User Account', { tag: ['@auth', '@cleanup'] }, async ({ page }) => {
//   await page.goto('/', { waitUntil: 'domcontentloaded' });
//   const products = new Products(page);
//   await products.deleteAccountClick();
//   await expect(page.getByText('Account Deleted!')).toBeVisible();
// });
});

});

