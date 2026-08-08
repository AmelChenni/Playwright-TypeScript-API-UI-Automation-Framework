import { expect, Locator, Page } from "@playwright/test";

export default class Products {
  readonly page: Page;
//   search
  readonly searchbox: Locator;
  readonly searchButton: Locator;
//   category
  readonly category: Locator;
//   products
readonly productButton:Locator
  readonly products :Locator;
  readonly productsTitles:Locator;
  readonly title:Locator;
//   product Detail
readonly productInfo:Locator;
readonly productName:Locator;
readonly productCategory:Locator;
readonly productPrice:Locator;
readonly productAvailability:Locator;
readonly productCondition:Locator;
readonly productBrand:Locator;
readonly brandsProducts:Locator;
readonly brandName:Locator;
readonly brandNumber:Locator;
readonly quantity:Locator;
readonly addToCartProductDetails:Locator;
// cart
readonly prod:Locator;
readonly addToCart:Locator;
readonly viewCart:Locator;
readonly continueShopping:Locator;
readonly modelContent :Locator;
readonly modelContentTitle:Locator;
readonly cartButton:Locator;
readonly cartContent:Locator;
readonly deleteCart:Locator;
readonly deleteAccount:Locator;

// delete compte



  constructor(page: Page) {
    this.page = page;
    // search
    this.searchbox = this.page.getByRole("textbox", { name: "search" });
    this.searchButton = this.page.locator("#submit_search");
    // category
    this.category = this.page.locator('#accordian');
    // products
    this.productButton = this.page.locator('.container .nav').getByRole('link', { name: 'Products' });
    this.products = this.page.locator('.features_items').locator('.product-image-wrapper')
    this.productsTitles = this.page.locator('.features_items .productinfo p');
    this.title = this.page.locator('.features_items .title')
    // product details
    this.productInfo = this.page.locator('.product-information');
    this.productName = this.page.locator('.product-information h2');
    this.productCategory = this.page.locator('.product-information p:has-text("Category:")');
    this.productPrice = this.page.locator('.product-information span span');
    this.productAvailability = this.page.locator('.product-information p:has-text("Availability:")');
    this.productCondition = this.page.locator('.product-information p:has-text("Condition:")');
    this.productBrand = this.page.locator('.product-information p:has-text("Brand:")');
    this.quantity = this.productInfo.locator('#quantity')
    this.addToCartProductDetails=this.productInfo.getByRole('button', { name: 'Add to cart' });
    // Brand
    this.brandsProducts = this.page.locator('.brands-name ul li')
    this.brandName = this.page.locator('.brands-name ul li a')
    this.brandNumber = this.page.locator('.brands-name ul li a span')
    // cart
    this.prod = this.page.locator('.single-products');;
    this.addToCart = this.prod.locator('.product-overlay .overlay-content a');
    this.modelContent  = this.page.locator('.modal-content');
    this.modelContentTitle = this.modelContent.locator('.modal-title');
    this.viewCart = this.modelContent.getByRole('link', { name: 'View Cart' });
    this.continueShopping = this.modelContent.getByRole('button', { name: 'Continue Shopping' });
    this.cartButton = this.page.locator('.container .nav').getByRole('link', { name: 'Cart' });
    this.cartContent = this.page.locator('#cart_info_table tbody tr');
    this.deleteCart = this.cartContent.locator("td .cart_quantity_delete")
// delete compte
    this.deleteAccount = this.page.locator('.container .nav').getByRole('link', { name: 'Delete Account' });



  }
  // search
  async fillSearchBox(searchWord: string) {
    await this.searchbox.fill(searchWord);
    await this.searchButton.click();
  }
  // category
  async chooseCategory(categoryWord :string){
    const catWord =  categoryWord.charAt(0).toUpperCase() + categoryWord.slice(1)
    const mainCategory = this.category.locator(`a[href="#${catWord}"]`)
    await mainCategory.click();
  }

  async chooseSubCategory(categoryName:string,subCategoryName :string){
    const subCatItem = this.page.locator(`#${categoryName} ul li a`, { hasText: subCategoryName });
if (!(await subCatItem.isVisible())) {
    await this.chooseCategory(categoryName);
  }
  await subCatItem.waitFor({ state: 'visible', timeout: 5000 });
      await subCatItem.click();

  }
//   Products
async productButtonClick(){
  await this.productButton.click()
}
  async getAllProductsExist(){
    return await this.products.all()
  }
  async getAllProductsTitle(){
return await this.productsTitles.allTextContents();
  }
  async viewFirstProductClick(){
        
    await this.products.first().getByText('View Product').click();
  }
  //   product detail
async getProductInfo(num:number) {
  const product = this.prod.nth(num)
    return {
      name: await product.locator('.productinfo p').nth(0).innerText(),
      price: await product.locator('.productinfo h2').nth(0).innerText(),
    };
}
//   product detail
async getProductDetails() {
    return {
      name: await this.productName.innerText(),
      category: await this.productCategory.innerText(),
      price: await this.productPrice.innerText(),
      availability: await this.productAvailability.innerText(),
      condition: await this.productCondition.innerText(),
      brand: await this.productBrand.innerText(),
    };
}
async quantityChange(num:string){
  await this.quantity.fill(num);
}
async addToCartProductDetailsClick(){
  await this.addToCartProductDetails.click()
}
// brandd

async allBrandsNumberArray(){
    const brandArray = await this.brandNumber.allTextContents()
    return brandArray;
}
async allBrandsNameArray(){
    const brandArray = await this.brandName.allTextContents()
    return brandArray;
}
async goToBrandExact(){
     await this.brandsProducts.first().locator('a').click()
}

// cart
async addToCartProductClick(num:number){
  await this.prod.nth(num).hover();
  await this.addToCart.nth(num).click();
}
async viewCartClick(){
    await this.viewCart.click()
}
async continueShoppingClick(){
    await this.continueShopping.click()
}


async cartButtonClick(){
  await this.cartButton.click()
}
async getCartContent(){
const content = this.cartContent.all()
  return content;
}
async getCartContity(){
const content = this.cartContent.locator('.cart_quantity button').textContent()
  return content;
}
async deleteCartClick(){
  await this.cartContent.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    const deleteC = await this.deleteCart?.all()
  if(deleteC.length && deleteC.length>0){
     const before = await this.cartContent.count();
  await this.deleteCart.first().click();
  await expect(this.cartContent).toHaveCount(before - 1);

  }
}
async getProductCartDetails(num:number) {
  const cartContentNum = this.cartContent.nth(num)
    return {
      name: await cartContentNum.locator('.cart_description h4 a').innerText(),
      price: await cartContentNum.locator('.cart_price p').innerText(),
    };
}

// delete compte
async deleteAccountClick(){
  await this.deleteAccount.click();
}

//   
  async getTitle(){
    return this.title.textContent();
  }
}
