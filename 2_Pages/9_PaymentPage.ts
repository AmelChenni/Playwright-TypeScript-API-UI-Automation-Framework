import { Locator, Page } from "@playwright/test";

export default class PaymentPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly paymentForm: Locator;
  
  
  readonly nameInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expMonthInput: Locator;
  readonly expYearInput: Locator;
  readonly submitBtn: Locator;

  readonly alertSuccess :Locator


  constructor(page: Page) {
    this.page = page;

    this.heading = this.page.locator('.heading');
    this.paymentForm = this.page.locator('#payment-form');

    //  
    this.nameInput = this.page.locator('input[data-qa="name-on-card"]');
    this.cardNumberInput = this.page.locator('input[data-qa="card-number"]');
    this.cvcInput = this.page.locator('input[data-qa="cvc"]');
    this.expMonthInput = this.page.locator('input[data-qa="expiry-month"]');
    this.expYearInput = this.page.locator('input[data-qa="expiry-year"]');
    
    this.submitBtn = this.page.locator('button[data-qa="pay-button"]');

    this.alertSuccess=this.page.locator('#success_message .alert-success')
  }

  // *******************Methods*************
  async payAndConfirm(name: string, cardNumber: string, cvc: string, expMonth: string, expYear: string) {
    await this.nameInput.fill(name);
    await this.cardNumberInput.fill(cardNumber);
    await this.cvcInput.fill(cvc);
    await this.expMonthInput.fill(expMonth);
    await this.expYearInput.fill(expYear);
    await this.submitBtn.click();
  }

  async getHTMLValidationError(locator: Locator): Promise<string> {
    return await locator.evaluate((element: HTMLInputElement) => element.validationMessage);
  }

  async submitClick(){
    await this.submitBtn.click()
  }
  async getAlertSuccess(){
    return await this.alertSuccess.textContent()
  }

 
}

