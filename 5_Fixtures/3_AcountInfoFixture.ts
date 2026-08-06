import AcuntInfoPage from '../2_Pages/4_AcountInfoPage';
import { test as base } from './2_SignupFixture';
import { faker } from '@faker-js/faker';

export const test = base.extend<{ acountInfoPage: AcuntInfoPage }>({
  acountInfoPage: async ({ page,registerLoginPage}, use) => {  
    await registerLoginPage.signup(faker.person.fullName(),faker.internet.email())
    const acountInfoPage = new AcuntInfoPage(page)
    await use(acountInfoPage);    

   },
});

export { expect } from '@playwright/test';