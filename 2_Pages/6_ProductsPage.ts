import { Locator, Page } from "@playwright/test";

export default class Products {
  readonly page: Page;
//   search
  readonly searchbox: Locator;
  readonly searchButton: Locator;
//   category
  readonly category: Locator;
//   products
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
// cart
readonly singleProduct:Locator;
readonly addToCart:Locator;
readonly viewCart:Locator;
readonly continueShopping:Locator;




  constructor(page: Page) {
    this.page = page;
    // search
    this.searchbox = this.page.getByRole("textbox", { name: "search" });
    this.searchButton = this.page.locator("#submit_search");
    // category
    this.category = this.page.locator('#accordian');
    // products
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
    // Brand
    this.brandsProducts = this.page.locator('.brands-name ul li')
    this.brandName = this.page.locator('.brands-name ul li a')
    this.brandNumber = this.page.locator('.brands-name ul li a span')
    // cart
    this.singleProduct = this.page.locator('.single-products');
    this.addToCart = this.singleProduct.getByRole('link', { name: 'Add to cart' });
    this.viewCart = this.page.locator('.modal-content').getByRole('link', { name: 'View Cart' });
    this.continueShopping = this.page.locator('.modal-content').getByRole('button', { name: 'Continue Shopping' });




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
async addToCartClick(locator:Locator){
}
async viewCartClick(){
    await this.viewCart.click()
}
async continueShoppingClick(){
    await this.continueShopping.click()
}



//   
  async getTitle(){
    return this.title.textContent();
  }
}
