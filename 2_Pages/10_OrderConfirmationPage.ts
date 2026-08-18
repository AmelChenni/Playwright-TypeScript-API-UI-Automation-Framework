import { Locator, Page } from "@playwright/test";

export default class OrderConfirmation{
    readonly page:Page;

    readonly title:Locator;
    readonly text:Locator;

    readonly download:Locator;
    readonly continue:Locator;


    // const
    constructor(page:Page){
        this.page =  page
        this.title = this.page.locator('h2[data-qa="order-placed"]');
        this.text = this.page.locator('.container div h2 ~ p');
        this.download= this.page.locator(".check_out");
        this.continue = this.page.locator('[data-qa="continue-button"]');
        // 
    }

    // method
    async downloadClick(){
        await this.download.click()
    }
     async continueClick(){
        await this.continue.click()
    }
}