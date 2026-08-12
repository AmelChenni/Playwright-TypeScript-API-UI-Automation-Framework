import { Locator, Page } from "@playwright/test";


export default class MainPage{
    readonly page :Page;
    readonly signupLoginBعttun : Locator; 
    readonly logoutItem:Locator;


      constructor(page: Page) {
        this.page = page;
        this.signupLoginBعttun = page.getByRole('link', { name: ' Signup / Login' });
        // const logoutItem = page.locator('li:has-text(" Logout")');

      }

      async signupLoginBعttunClick(){
        await this.signupLoginBعttun.click({ force: true })
      }
 
}