// Setup Project
// ↓
// Generate User (API)
// ↓
// Register (API)
// ↓
// Login (UI)
// ↓
// Save storageState
// ↓
// save the current user

// tests/global.setup.ts
import { test as setup, expect } from '@playwright/test';
import UserApi from '../3_API/UserApi';
import { buildUserDetails } from '../4_Data/1-UserData';
import RegisterLoginPage from '../2_Pages/2_RegisterLoginPage';
import * as fs from 'fs'; 

setup('Authenticate and Seed Database', async ({ page,request,context }) => {
// ├── Generate User (API)
const newUser = buildUserDetails()
const userApi = new UserApi(request);
// Register (API)
const responseRegister  = await userApi.register(newUser)
  expect(responseRegister.ok()).toBeTruthy();
// Login (UI)
await page.goto('/login');
const loginUI = new RegisterLoginPage(page)
const responseLogin = await loginUI.login(newUser.email,newUser.password)
await expect(page.getByText('Logout')).toBeVisible()
await page.context().storageState({ path: 'playwright/.auth/user.json' });

//  save the user
  fs.writeFileSync(
    'playwright/.auth/user-data.json',
    JSON.stringify(newUser, null, 2)
  );
});











