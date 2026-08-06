import { Locator, Page } from "@playwright/test";


export default class MainPage{
    readonly page :Page;
    readonly signupLoginBottun : Locator; 
    readonly logoutItem:Locator;


      constructor(page: Page) {
        this.page = page;
        this.signupLoginBottun = page.getByRole('link', { name: ' Signup / Login' });
        // const logoutItem = page.locator('li:has-text(" Logout")');

      }

      async signupLoginBottunClick(){
        await this.signupLoginBottun.click({ force: true })
      }
 
}