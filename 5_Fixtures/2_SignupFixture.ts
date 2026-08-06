import RegisterLoginPage from '../2_Pages/2_RegisterLoginPage';
import { test as base } from './1_SignupLoginFixture';

export const test = base.extend<{ registerLoginPage: RegisterLoginPage }>({
  registerLoginPage: async ({ page,mainPage}, use) => {  
    const registerLoginPage = new RegisterLoginPage(page);
    await use(registerLoginPage);    

   },
});

export { expect } from '@playwright/test';