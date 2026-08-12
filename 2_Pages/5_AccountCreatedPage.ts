import { Locator, Page } from "@playwright/test";


export default class AccountCreatedPage{
    readonly page :Page;
    readonly text : Locator;
    readonly contuneButton: Locator

      constructor(page: Page) {
        this.page = page;
        this.text = page.locator('[data-qa="account-created"]');
        this.contuneButton = page.locator('[data-qa="continue-button"]');

      }

      async getTextPageCreated(){
        return await this.text.innerText()
      }
         async contuneButtonClick(){
        return await this.contuneButton.click();
      }
 
 
}