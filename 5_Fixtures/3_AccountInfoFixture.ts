import AcuntInfoPage from '../2_Pages/4_AccountInfoPage';
import { test as base } from './2_SignupFixture';
import { faker } from '@faker-js/faker';

export const test = base.extend<{ AccountInfoPage: AcuntInfoPage }>({
  AccountInfoPage: async ({ page,registerLoginPage}, use) => {  
    await registerLoginPage.signup(faker.person.fullName(),faker.internet.email())
    const AccountInfoPage = new AcuntInfoPage(page)
    await use(AccountInfoPage);    

   },
});

export { expect } from '@playwright/test';