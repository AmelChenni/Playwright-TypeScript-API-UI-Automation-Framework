import { Locator, Page } from "@playwright/test";


export default class AcuntInfoPage{
  readonly page: Page;
  readonly mrRadio: Locator;
  readonly mrsRadio: Locator;
  readonly passwordInput: Locator;
  readonly daysSelect: Locator;
  readonly monthsSelect: Locator;
  readonly yearsSelect: Locator;
  readonly newsletterCheckbox: Locator;
  readonly specialOffersCheckbox: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly createAccountButton: Locator;

      constructor(page: Page) {
      this.page = page;
    this.mrRadio = page.locator('#id_gender1');
    this.mrsRadio = page.locator('#id_gender2');
    this.passwordInput = page.locator('[data-qa="password"]');
    this.daysSelect = page.locator('[data-qa="days"]');
    this.monthsSelect = page.locator('[data-qa="months"]');
    this.yearsSelect = page.locator('[data-qa="years"]');
    this.newsletterCheckbox = page.locator('#newsletter');
    this.specialOffersCheckbox = page.locator('#optin');
    this.firstNameInput = page.locator('[data-qa="first_name"]');
    this.lastNameInput = page.locator('[data-qa="last_name"]');
    this.companyInput = page.locator('[data-qa="company"]');
    this.address1Input = page.locator('[data-qa="address"]');
    this.address2Input = page.locator('[data-qa="address2"]');
    this.countrySelect = page.locator('[data-qa="country"]');
    this.stateInput = page.locator('[data-qa="state"]');
    this.cityInput = page.locator('[data-qa="city"]');
    this.zipcodeInput = page.locator('[data-qa="zipcode"]');
    this.mobileNumberInput = page.locator('[data-qa="mobile_number"]');
    this.createAccountButton = page.locator('[data-qa="create-account"]');
  }

    async fillAccountDetails(details: any) {
    if (details.gender === 'Mr') await this.mrRadio.check();
    if (details.gender === 'Mrs') await this.mrsRadio.check();
    
    await this.passwordInput.fill(details.password);
    await this.daysSelect.selectOption(details.day);
    await this.monthsSelect.selectOption(details.month);
    await this.yearsSelect.selectOption(details.year);

    if (details.newsletter) await this.newsletterCheckbox.check();
    if (details.specialOffers) await this.specialOffersCheckbox.check();

    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.address1Input.fill(details.address1);
    await this.countrySelect.selectOption(details.country);
    await this.stateInput.fill(details.state);
    await this.cityInput.fill(details.city);
    await this.zipcodeInput.fill(details.zipcode);
    await this.mobileNumberInput.fill(details.mobile);
    await Promise.all([
    this.createAccountButton.click({ force: true })
  ]);
 
  
}
  async getHTMLValidationError(locator:Locator){
    const validationMessage = await locator.evaluate(
  (element: HTMLInputElement) => element.validationMessage);
return validationMessage;
  }
}

