import CartPage from "../2_Pages/7_CartPage";
import CheckoutPage from "../2_Pages/8_CheckoutPage";
import { expect, test } from "../5_Fixtures/5_CartFixture";
import * as fs from "fs";
import * as path from "path";
import { priceStringToInt } from "../6_Utils/priceHelper";
import PaymentPage from "../2_Pages/9_PaymentPage";

// read the information from the json file
function getAuthenticatedUser() {
  const filePath = path.join(process.cwd(), "playwright/.auth/user-data.json");
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

// *****************UI & Layout Tests****************************
test.describe("UI & Layout Tests", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page, addProducts }) => {
    const productsId = [0];
    const cart = await addProducts(productsId);
    await page.goto("/view_cart", { waitUntil: "domcontentloaded" });
    await cart.proccedToCheckoutBtnClick();
  });
  test(
    "Checkout Page - Basic Rendering ",
    { tag: "@auth" },
    async ({ page }) => {
      const checkoutPage = new CheckoutPage(page);
      await expect(page).toHaveURL(/checkout/);
      await expect(checkoutPage.addressDetailsHeading).toBeVisible();
      await expect(checkoutPage.reviewOrder).toBeVisible();
      await expect(checkoutPage.orderMsg).toBeVisible();
    
      await expect(checkoutPage.placeOrder).toBeVisible();
      await expect(checkoutPage.breadcrumb).toHaveText("Home Checkout");
    },
  );

  test(
    "Address Details - Delivery Address Matches Account ",
    { tag: "@auth" },
    async ({ page }) => {
      const checkoutPage = new CheckoutPage(page);
      await expect(page).toHaveURL(/checkout/);
      // get the adress from the checkout page
      const informationResult = await checkoutPage.getAddressDetails();
      // get the adress from the

      const authenticatedUser = {
        fullName: [
          getAuthenticatedUser().firstName,
          getAuthenticatedUser().lastName,
        ].join(" "),
        adress: getAuthenticatedUser().address1,
        cityStatePostal: [
          getAuthenticatedUser().city,
          getAuthenticatedUser().state,
          getAuthenticatedUser().zipcode,
        ].join(" "),
        country: getAuthenticatedUser().country,
        mobile: getAuthenticatedUser().mobile,
      };
      // check
      expect(informationResult).toEqual(authenticatedUser);
    },
  );

  test(
    "Address Details - Both Addresses Are Identical (Default Case) ",
    { tag: "@auth" },
    async ({ page }) => {
      const checkoutPage = new CheckoutPage(page);
      const addressDetail = await checkoutPage.getAddressDetails();
      const addressInvoice = await checkoutPage.getAddressInvoice();

      expect(addressDetail).toEqual(addressInvoice);
    },
  );
});

// *****************Review Order - Data Integrity****************************

test.describe("Review Order - Data Integrity", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page, addProducts }) => {
    const productsIndex = [1, 2, 8];
    const cart = await addProducts(productsIndex);
    await page.goto("/view_cart", { waitUntil: "domcontentloaded" });
  });

  test(
    "Review Order - Cart Items Match ",
    { tag: "@auth" },
    async ({ page }) => {
      // get the products table from  cart page
      const cartPage = new CartPage(page);
      const cartBodyLenght = await cartPage.cartBodyLenght();
      const cartProducts: { name: string; price: string }[] = [];
      for (let i = 0; i < cartBodyLenght; i++) {
        cartProducts.push({
          name: (await cartPage.getCartContent(i)).name,
          price: (await cartPage.getCartContent(i)).price,
        });
      }

      // get the prodcuts from checkout page
      await cartPage.proccedToCheckoutBtnClick();
      const checkoutPage = new CheckoutPage(page);
      // const checkoutBodyLength = await cartPage.cartBodyLenght();
      const checkoutBodyLength = await checkoutPage.cartBodyLenght()
      const checkoutProducts: { name: string; price: string }[] = [];
      for (let i = 0; i < checkoutBodyLength-1; i++) {
        checkoutProducts.push({
          name: (await checkoutPage.getCartContent(i)).name,
          price: (await checkoutPage.getCartContent(i)).price,
        });
      }
      expect(checkoutProducts).toEqual(cartProducts);
    },
  );

  test(
    "Review Order - Item Total Calculation ",
    { tag: "@auth" },
    async ({ page }) => {
      const checkoutPage = new CheckoutPage(page);
      await page.goto("checkout");
      await expect(page).toHaveURL(/checkout/);

      const cartLenght = await checkoutPage.cartBodyLenght();
      for (let i = 0; i < cartLenght - 1; i++) {
        const price = priceStringToInt(
          (await checkoutPage.getCartContent(i)).price,
        );
        const quantity = parseInt(
          (await checkoutPage.getCartContent(i)).quantity,
        );
        const total = priceStringToInt(
          (await checkoutPage.getCartContent(i)).total,
        );

        expect(price * quantity).toEqual(total);
      }
    },
  );

  test(
    "Review Order - Overall Total Matches Cart Total ",
    { tag: "@auth" },
    async ({ page }) => {
      const checkoutPage = new CheckoutPage(page);
      await page.goto("checkout");

      const cartLenght = await checkoutPage.cartBodyLenght();
      // calc  total from cart
      let totalCart: number = 0;
      for (let i = 0; i < cartLenght - 1; i++) {
        const total = priceStringToInt(
          (await checkoutPage.getCartContent(i)).total,
        );
        totalCart += total;
      }
      // get  total from checkout page
      const totalExpect = priceStringToInt(
        await checkoutPage.getCartTotalPrice(),
      );
      expect(totalCart).toEqual(totalExpect);
    },
  );
  test(
    "Review Order - Product Count Matches ",
    { tag: "@auth" },
    async ({ page }) => {
      // get the lenght form cart page
      const cartPage = new CartPage(page);
      const cartLenght = await cartPage.cartBodyLenght();

      // get the lenght form checkout page
      await cartPage.proccedToCheckoutBtnClick();
      const checkoutPage = new CheckoutPage(page);
      // the line of the total
      const checkoutLenght = (await checkoutPage.cartBodyLenght()) - 1;

      expect(cartLenght).toEqual(checkoutLenght);
    },
  );
});
// *****************Order Comment Tests****************************

test.describe("Order Comment Tests", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page, addProducts }) => {
    const productsIndex = [1, 2, 8];
    const cart = await addProducts(productsIndex);
    await page.goto("/view_cart", { waitUntil: "domcontentloaded" });
    await cart.proccedToCheckoutBtnClick()
  });

  test('Order Comment - Add Comment Text ',{tag:"@auth"}, async({page}) => {
    const checkoutPage = new CheckoutPage(page)
    const text = "hello"
    await checkoutPage.addCommentText(text);
    // expect(await checkoutPage.getCommentText()).toContain(text)    
    await expect(checkoutPage.commentTextArea).toHaveValue(text)    
  })
   test('Order Comment - Submit With Comment ',{tag:"@auth"}, async({page}) => {
    const checkoutPage = new CheckoutPage(page)
     const text = "hello"
    await checkoutPage.addCommentText(text);
    await checkoutPage.placeOrderClick()
    await expect(page).toHaveURL('payment')
  })
  test('Order Comment - Submit Without Comment (Optional Field) ',{tag:"@auth"}, async({page}) => {
    const checkoutPage = new CheckoutPage(page)
    await checkoutPage.placeOrderClick()
    await expect(page).toHaveURL('payment')
  })
});

// *****************EDGE CASES************************************
test.describe("EDGE CASES",()=>{
  test.describe.configure({ mode: "serial" });

    test('Checkout - Direct URL Access Without Login with button ', async({page,addProducts}) => {
        const productsId = [0];
    const cart = await addProducts(productsId);
    await page.goto("/view_cart", { waitUntil: "domcontentloaded" });
    await cart.proccedToCheckoutBtnClick()
        const checkoutPage = new CheckoutPage(page)
    await expect(checkoutPage.modelContent).toBeVisible()
    await expect(checkoutPage.modalFooterBtn).toBeVisible()
    await expect(checkoutPage.modelContentTitle).toHaveText(/.*Checkout.*/)
    await expect(checkoutPage.modalBodyText).toHaveText("Register / Login account to proceed on checkout.")
    
    })
    // Finding:
// The application allows Guest checkout and order completion.
      test('Checkout - Guest Can Complete Order via Direct URL', async({page,addProducts}) => {
        const productsId = [0];
    const cart = await addProducts(productsId);
    await page.goto("/checkout", { waitUntil: "domcontentloaded" });

    // checkout page
    const checkoutPage = new CheckoutPage(page)
await expect(checkoutPage.cartTotalPrice).toContainText('0');
    await checkoutPage.placeOrderClick();

    // payment order
    const payment =new PaymentPage(page);
    await payment.payAndConfirm("amel","123456789","123","20","2025")
    await expect(page).toHaveURL(/.*payment_done.*/)
    
    
    })
    // Finding:
// The application allows checkout and order completion
// with an empty cart.
     test('Checkout - Empty Cart Does NOT Block Order (Site Allows Zero-Item Checkout) ',{tag:"@auth"}, async({page,addProducts}) => {
        await page.goto("/checkout", { waitUntil: "domcontentloaded" });
      const checkoutPage = new CheckoutPage(page)
      await expect(checkoutPage.cartTotalPrice).toContainText('0');
    await checkoutPage.placeOrderClick();   
     // payment order
    const payment =new PaymentPage(page);
    await payment.payAndConfirm("amel","123456789","123","20","2025")
    await expect(page).toHaveURL(/.*payment_done.*/)    
    })
})