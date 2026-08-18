import { Locator, Page } from "@playwright/test";

export default class CheckoutPage{
    readonly page:Page;
    // breadcrumb 
    readonly breadcrumb : Locator
    // Address Details

    readonly addressDetailsHeading :Locator;
    readonly addressDelivery:Locator;
    readonly addressInvoice:Locator;
    // Review Your Order
    readonly reviewOrder:Locator;
    readonly orderTable:Locator;
    readonly cartBody:Locator;
    readonly cartTotalPrice:Locator;
    // Order message
    readonly orderMsg:Locator;
    readonly commentTextArea :Locator;
    // place order
    readonly placeOrder:Locator
    // EDGE CASES
    readonly modelContent:Locator
    readonly modalHeader:Locator
    readonly modelContentTitle:Locator
    readonly modalBody:Locator
    readonly modalBodyText:Locator
    readonly modalFooter:Locator
    readonly modalFooterBtn:Locator;



    // constructor
    constructor(page:Page){
        this.page = page;
        // breadcrumb 
        this.breadcrumb =this.page.locator('.breadcrumbs .breadcrumb')
        // Address Details

        this.addressDetailsHeading = this.page.locator('.step-one .heading').first()
        this.addressDelivery =this.page.locator('#address_delivery')
        this.addressInvoice =this.page.locator('#address_invoice')
        


    // Review Your Order

        this.reviewOrder = this.page.locator('.step-one .heading').nth(1)
        // this.orderTable= this.page.locator('.cart_info tbody tr')
        this.cartBody= this.page.locator('.cart_info tbody tr')
        this.cartTotalPrice = this.cartBody.locator('.cart_total_price').last();    
    // Order message
        this.orderMsg= this.page.locator('#ordermsg')
        this.commentTextArea = this.page.locator('textarea[name="message"]');

        // place order
        this.placeOrder = this.page.locator('.check_out')
        // EDGE CASES
            this.modelContent  = this.page.locator('.modal-content');

            this.modalHeader = this.modelContent.locator('.modal-header');
            this.modelContentTitle  = this.modalHeader.locator('.modal-title');

            this.modalBody = this.modelContent.locator('.modal-body');
            this.modalBodyText = this.modalBody.locator('p').first()

            this.modalFooter = this.modelContent.locator('.modal-footer');
            this.modalFooterBtn = this.modalFooter.getByRole('button', { name: 'Continue On Cart' })

    }


    // ///////////////////////////////////////////////////
        // *****************breadcrumbs****************************

        // breadcrumbs
        async getBreadcrumbs(){
            const breadcrumbs =  await this.breadcrumb.innerText()
            return breadcrumbs;

        }

        // *****************Address Details****************************

        async getAddressDetails(){
            return {
      fullName: (await this.addressDelivery.locator('.address_firstname').innerText()).split('. ')[1],
      adress: [...await this.addressDelivery.locator('.address_address1').allInnerTexts()].join(''),
      cityStatePostal: (await this.addressDelivery.locator('.address_city').innerText()),
      country: (await this.addressDelivery.locator('.address_country_name').innerText()),
      mobile: (await this.addressDelivery.locator('.address_phone').innerText()),
    };
}
          async getAddressInvoice(){
            return {
      fullName: (await this.addressInvoice.locator('.address_firstname').innerText()).split('. ')[1],
      adress: [...await this.addressInvoice.locator('.address_address1').allInnerTexts()].join(''),
      cityStatePostal: (await this.addressInvoice.locator('.address_city').innerText()),
      country: (await this.addressInvoice.locator('.address_country_name').innerText()),
      mobile: (await this.addressInvoice.locator('.address_phone').innerText()),
    };
        }
// *****************Review Order - Data Integrity****************************
         async cartBodyLenght(){
    const cartBodyLenght = (await this.cartBody.all()).length
    return cartBodyLenght
}
    async getCartContent(num) {
        const cartBodyTr =  await this.cartBody.nth(num);
    return {
    //   imageSrc: await cartBodyTr.locator('td .product_image').getAttribute('src'),
      name: (await cartBodyTr.locator('.cart_description h4 a').innerText()),
    //   description: await cartBodyTr.locator('.cart_description  a').innerText(),
      price: await cartBodyTr.locator('.cart_price').innerText(),
      quantity: await cartBodyTr.locator('.cart_quantity').innerText(),
      total: await cartBodyTr.locator('.cart_total_price').innerText(),
    //   brand: await cartBodyTr.locator('td').last().innerText(),
    };
}

    async getCartTotalPrice(){
        const total = await this.cartTotalPrice.textContent();
        return total ?? '';   
     }
// *****************Order Comment Tests****************************
         
         async addCommentText(text:string){
            await this.commentTextArea.fill(text)
         }
         async getCommentText(){
            const msg=  await this.commentTextArea.inputValue();
            return msg ?? ' ';   

         }
// *****************place order***************************

async placeOrderClick(){
    await this.placeOrder.click()
}
// *****************EDGE CASESr***************************









}