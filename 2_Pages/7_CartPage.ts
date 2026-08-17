import { Locator, Page } from "@playwright/test";


export default class CartPage{
    readonly page:Page;
    // readonly cartInfo :Locator;
    readonly emptyCart :Locator;
    readonly cartHeaders:Locator;
    readonly cartBody:Locator;
    // readonly price:Locator;
    readonly quantity:Locator;
    // readonly total:Locator;
    // readonly delete:Locator;
    readonly proccedToCheckoutBtn:Locator;
    readonly buyProductsBtn:Locator;
    readonly homeBtn:Locator;


    // constructor
    constructor(page:Page){
        this.page=page;
        // this.cartInfo= this.page.locator('#cart_info')
        this.emptyCart= this.page.locator('#cart_info #empty_cart')
        this.buyProductsBtn= this.emptyCart.getByRole('link',{name:'here'})
        this.cartHeaders= this.page.locator('.cart_menu')
        this.cartBody= this.page.locator('.cart_info tbody tr')
        // this.price= this.page.locator('.cart_menu .price')
        this.quantity= this.page.locator('.cart_menu .quantity')
        // this.total= this.page.locator('.cart_menu .total')
        // this.delete= this.page.locator('.cart_menu')
        this.proccedToCheckoutBtn= this.page.locator(".container .check_out")
        this.homeBtn= this.page.locator('.breadcrumb').getByRole('link',{name:'Home'})
    }
    // methodes

    // empty cart
    async buyProductsBtnClick(){
        await this.buyProductsBtn.click()
    }
       async homeBtnClick(){
        await this.homeBtn.click()
    }
    async getCartHeaders() {
    return {
      name: await this.cartHeaders.locator('.image').innerText(),
      description: await this.cartHeaders.locator('.description').innerText(),
      price: await this.cartHeaders.locator('.price').innerText(),
      quantity: await this.cartHeaders.locator('.quantity').innerText(),
      total: await this.cartHeaders.locator('.total').innerText(),
      brand: await this.cartHeaders.locator('td').last().innerText(),
    };
}
// full cart

    async getcartContent(num) {
        const cartBodyTr =  await this.cartBody.nth(num);
    return {
    //   imageSrc: await cartBodyTr.locator('td .product_image').getAttribute('src'),
      name: (await cartBodyTr.locator('.cart_description h4 a').innerText()),
    //   description: await cartBodyTr.locator('.cart_description  a').innerText(),
      price: await cartBodyTr.locator('.cart_price').innerText(),
      quantity: await cartBodyTr.locator('.cart_quantity'),
      total: await cartBodyTr.locator('.cart_total_price').innerText(),
    //   brand: await cartBodyTr.locator('td').last().innerText(),
    };
}
async cartBodyLenght(){
    const cartBodyLenght = (await this.cartBody.all()).length
    return cartBodyLenght
}
async changeQuantity(num:string){
   (await this.getcartContent(0)).quantity.fill(num)
}

async proccedToCheckoutBtnClick(){
    await this.proccedToCheckoutBtn.click()
}
// delete
// async deleteCartClick(num:number){
//   await this.cartContent.nth(num).waitFor({ state: 'visible', timeout: 5000 });
//     const deleteC = await this.deleteCart?.all()
//   if(deleteC.length && deleteC.length>0){
//      const before = await this.cartContent.count();
//   await this.deleteCart.nth(num).click();
//   await expect(this.cartContent).toHaveCount(before - 1);

//   }
// }
}