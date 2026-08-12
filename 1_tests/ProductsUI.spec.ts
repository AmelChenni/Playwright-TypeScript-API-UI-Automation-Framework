import test, { expect } from "@playwright/test";
import Products from "../2_Pages/6_ProductsPage";

test.beforeEach(async ({ page }) => {
  await page.route("**/*google*ads***", (route) => route.abort());
  await page.route("**/*doubleclick***", (route) => route.abort());
  await page.goto("/products");
});


// Products
test.describe("Products Test Cases", () => {
  test("Products Page - Basic Rendering", async ({ page }) => {
    const products = new Products(page);
    await expect(page).toHaveURL(/products/);
    expect(await products.getTitle()).toContain("All Products");
    const productsArray = await products.getAllProductsExist();
    expect(Array.isArray(productsArray)).toBe(true);
    expect(productsArray.length).toBeGreaterThan(0);
  });
});
// search
test.describe("Search Functionality Tests", () => {
  test("Search - Valid Product Name", async ({ page }) => {
    const products = new Products(page);
    const searchWord = "top";
    await products.fillSearchBox(searchWord);
    await expect(page).toHaveURL(`/products?search=${searchWord}`);

    const allProducts = await products.getAllProductsTitle();
    expect(allProducts.length).toBeGreaterThan(0);

    // find just the titles contain the search word
    const matchingProducts = allProducts.filter((title) =>
      title.toLowerCase().includes(searchWord.toLowerCase()),
    );

    // count the percentage
    const matchRatio = matchingProducts.length / allProducts.length;
    expect(matchRatio).toBeGreaterThanOrEqual(0.7);
  });
  test("Search - Invalid / Non-Existing Product", async ({ page }) => {
    const products = new Products(page);
    const searchWord = "xyz123";
    await products.fillSearchBox(searchWord);
    await expect(page).toHaveURL(`/products?search=${searchWord}`);

    const allProducts = await products.getAllProductsTitle();
    expect(allProducts.length).toEqual(0);
    expect(await products.getTitle()).toContain("Searched Products");
  });
  test("Search - Empty Query", async ({ page }) => {
    const products = new Products(page);
    const searchWord = " ";
    await products.fillSearchBox(searchWord);
    await expect(page).toHaveURL(`/products?search=${searchWord}`);

    const allProducts = await products.getAllProductsTitle();

    expect(allProducts.length).toBeGreaterThan(0);
    expect(await products.getTitle()).toContain("All Products");
  });
});
// details
test.describe("Detail Page Navigation", () => {
  test("Product Details - View First Product ", async ({ page }) => {
    const products = new Products(page);
    await products.viewProductDetailsClick(0);
    await expect(page).toHaveURL(`/product_details/1`);
  });
  test("Product Details - Verify Essential Fields", async ({ page }) => {
    const products = new Products(page);
    await products.viewProductDetailsClick(0);
    //is visible    
    await expect(products.productName).toBeVisible();
    await expect(products.productCategory).toBeVisible();
    await expect(products.productPrice).toBeVisible();
    await expect(products.productAvailability).toBeVisible();
    await expect(products.productCondition).toBeVisible();
    await expect(products.productBrand).toBeVisible();

    // is correct
    const details = await products.getProductDetails();

    expect(details.name.length).toBeGreaterThan(0);
    expect(details.category).toContain("Category:");
    expect(details.price).toContain("Rs.");
    expect(details.availability).toContain("In Stock");
    expect(details.condition).toContain("New");
    expect(details.brand).toBeTruthy();
  });
});
// categories
const categories = [
  { name: "Women", subCategory: ["Dress", "Tops", "Saree"] },
  { name: "Men", subCategory: ["Tshirts", "Jeans"] },
  { name: "Kids", subCategory: ["Dress", "Tops & Shirts"] },
];
test.describe("Categories", () => {
  for (const cat of categories) {
    test(`should get category correct ${cat.name}`, async ({ page }) => {
      const products = new Products(page);
      await products.chooseCategory(`${cat.name}`);
      for (const subCat of cat.subCategory) {
        expect(
          page.locator(`#${cat.name} ul li`).filter({ hasText: `${subCat}` }),
        ).toBeVisible();
      }
    });
  }
});

test.describe("Categories", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/products");
  });
  for (const cat of categories) {
    for (const subCat of cat.subCategory) {
      test(`should get the subcategory correct ${cat.name} ${subCat}`, async ({
        page,
      }) => {
        const products = new Products(page);
        await products.chooseCategory(`${cat.name}`);
        await products.chooseSubCategory(cat.name, subCat);
        await expect(page).toHaveURL(/category_products/);
        const title = await products.getTitle();
        expect(title).toContain(subCat);
      });
    }
  }
});

// Brand
test.describe("Brands Filter Tests",()=>{

    test('Brands - Verify Brand Counts are Valid Numbers ', async({page}) => {
    const products = new Products(page);
    const brandsNumber =await products.allBrandsNumberArray();

    expect(brandsNumber.length).toBeGreaterThan(0);
    for(const brandNum of brandsNumber){
        const cleanNumber = parseInt(brandNum.replace(/[()]/g, '').trim())
        
    expect(isNaN(cleanNumber)).toBe(false);
    expect(cleanNumber).toBeGreaterThan(0);   
 }
      
})
    

 test('Brands - Verify Brand Name are Valid String ', async({page}) => {
    const products = new Products(page);
    const brandsName =await products.allBrandsNameArray();

    expect(brandsName.length).toBeGreaterThan(0);
    
    for(const brandName of brandsName){
        const cleanNumber = brandName.trim().slice(3,brandName.length-1)
    expect(typeof cleanNumber==="string").toBeTruthy()
    expect(cleanNumber.length).toBeGreaterThan(0);   
 }
      
})
 test('Brands - Filter Products by Brand', async({page}) => {
    const products = new Products(page);


    await products.goToBrandExact()

    await expect(page).toHaveURL(`/brand_products/Polo`)
    expect(await products.getTitle()).toContain('Polo')

    const numberExist = await products.allBrandsNumberArray()
    const numberExistClean = parseInt(numberExist[0].replace(/[()]/g, '').trim())
    const expectNumber =(await products.getAllProductsExist()).length;

    expect (numberExistClean).toEqual(expectNumber)
    
})
})

// cart
test.describe("Add to Cart Integration", () => {
  test.describe.configure({ mode: 'serial' });   

test.beforeEach(async({page})=>{
    await expect(page.getByText("Logout")).toBeVisible();
})
test.afterEach(async({page})=>{

  const products = new Products(page);
  
await page.goto('/view_cart');
  let contents = await products.getCartContent();  
 while (contents.length>0) {
   await products.deleteCartClick();  
  contents = await products.getCartContent()
 }
})
  test('Cart - Add Single Product from Hover or Card', { tag: '@auth' }, async ({ page }) => {
    const products = new Products(page);
    const productNum = 0;

    await products.addToCartProductClick(productNum);
    await expect(products.modelContent).toBeVisible()
    await expect(products.modelContentTitle).toHaveText('Added!')

    // product details from product page
    const productDetail = await products.getProductInfo(productNum)
    
    // go to cart and check
    await products.viewCartClick();
    // product details from Cart page
    let contents = await products.getCartContent();
    expect(contents.length).toEqual(1);

    const productCartDetail=await products.getProductCartDetails(productNum);

    const areEqual = JSON.stringify(productDetail) === JSON.stringify(productCartDetail); 
    expect(areEqual).toBeTruthy()
        expect(productDetail).toEqual(productCartDetail);
  });

  test('Cart - Continue Shopping working', { tag: '@auth' }, async ({ page }) => {
  const products = new Products(page);
  const productNum = 0;
    await products.addToCartProductClick(productNum); 
    await products.continueShoppingClick();
    await expect(page).toHaveURL(/products/)
    await expect( products.modelContent).not.toBeVisible()
  });
    test('Cart - View cart working', { tag: '@auth' }, async ({ page }) => {
  const products = new Products(page);
    const productNum = 0;
    await products.addToCartProductClick(productNum); 
    await expect( products.modelContent).toBeVisible()
    await products.viewCartClick();
    await expect( products.modelContent).not.toBeVisible()
    await expect(page).toHaveURL(/view_cart/)
  });

    test('Cart - Add Multiple Quantities from Product Details', { tag: '@auth' }, async ({ page }) => {
  const products = new Products(page);
//   // clean the cart
 await page.goto('/view_cart');
  let contents = await products.getCartContent();  
 while (contents.length>0) {
   await products.deleteCartClick();  
  contents = await products.getCartContent()
 }
//  back to product page
  await products.productButtonClick();

  const num ="5"
  await products.viewProductDetailsClick(0)
  await expect(page).toHaveURL(`/product_details/1`);
  await products.quantityChange(num);

  await products.addToCartProductDetailsClick();
    
    await expect(products.modelContent).toBeVisible()
    await expect(products.modelContentTitle).toHaveText('Added!')

    // go to cart to check the quantity
    await products.viewCartClick();
    const quantityCart = await products.getCartQuantity()

      
    expect(num).toEqual(quantityCart)


   
  });

   test('Cart - Add Multiple Products', { tag: '@auth' }, async ({ page }) => {
  
   const products = new Products(page);
//   // clean the cart
 await page.goto('/view_cart');
  let contents = await products.getCartContent();  
 while (contents.length>0) {
   await products.deleteCartClick();  
  contents = await products.getCartContent()
 }
   await products.productButtonClick();
    const firstProductNum = 2;
    const productDetailFirst = await products.getProductInfo(firstProductNum)

    await products.addToCartProductClick(firstProductNum);
    await products.continueShoppingClick();

    const secondProductNum = 3;
    const productDetailSecond = await products.getProductInfo(secondProductNum)
    await products.addToCartProductClick(secondProductNum);
    await products.viewCartClick();


    // product details from Cart page
    const cartContents = await products.getCartContent();
    expect(cartContents.length).toEqual(2);

    const productCartDetailFirst=await products.getProductCartDetails(0);
    const productCartDetailSecond=await products.getProductCartDetails(1);
    
    const areEqualFirst = JSON.stringify(productCartDetailFirst) === JSON.stringify(productDetailFirst); 
    const areEqualSecond = JSON.stringify(productCartDetailSecond) === JSON.stringify(productDetailSecond); 
    expect(areEqualFirst).toBeTruthy()
    expect(productCartDetailFirst).toEqual(productDetailFirst);
    expect(areEqualSecond).toBeTruthy()
    expect(productCartDetailSecond).toEqual(productDetailSecond);

   
  });


});
