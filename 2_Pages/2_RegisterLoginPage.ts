import { Locator, Page } from "@playwright/test";


export default class RegisterLoginPage {
  readonly page: Page;
  readonly signupName: Locator;
  readonly signupEmail: Locator;
  readonly signupButton: Locator;
  readonly signupEmailError: Locator;
  readonly loginEmail: Locator;
  readonly loginPassword: Locator;
  readonly loginButton: Locator;



  constructor(page: Page) {
    this.page = page;
    this.signupName = page.locator('[data-qa="signup-name"]');
    this.signupEmail = page.locator('[data-qa="signup-email"]');
    this.signupEmailError = page.locator('.signup-form').locator('p');
    this.signupButton = page.getByRole('button', { name: 'Signup' });
    this.loginEmail = page.locator('[data-qa="login-email"]');
    this.loginPassword = page.locator('[data-qa="login-password"]');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }


  async signup(name: string, email: string) {
    await this.signupName.fill(name);
    await this.signupEmail.fill(email);
    await this.signupButton.click({ force: true })
  }
  async login(email: string, password: string) {
    await this.loginEmail.fill(email);
    await this.loginPassword.fill(password);
    await this.loginButton.click({ force: true })
  }
  async getSignupEmailError() {
    return await this.signupEmailError.textContent()
  }
  async getHTMLValidationError(locator: Locator) {
    const validationMessage = await locator.evaluate(
      (element: HTMLInputElement) => element.validationMessage);
    return validationMessage;
  }






}