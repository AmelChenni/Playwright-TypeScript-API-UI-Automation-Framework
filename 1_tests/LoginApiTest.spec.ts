

import { expect, test } from "@playwright/test";
import LoginApi from '../3_API/LoginApi';
import UserApi from "../3_API/UserApi";
import { buildUserDetails, UserDetails } from "../4_Data/1-UserData";
import { faker } from "@faker-js/faker";
import Products from "../2_Pages/6_ProductsPage";


test.describe('login test',()=>{
  
    let userApi: UserApi;
    let currentUser: UserDetails;
  
    test.beforeEach(async ({ request }) => {
      userApi = new UserApi(request);
      currentUser = buildUserDetails(); 
      await userApi.register(currentUser);
    });
      test.afterEach(async ({ request }) => {
      userApi = new UserApi(request);
      await userApi.delete(currentUser.email,currentUser.password);
    });
  test("POST To Verify Login without email parameter", async ({request}) => {
    const response  =  new LoginApi(request);
    const responseBody = await response.login(faker.internet.email());
    
   const responseBodyJson = await responseBody.json();   
    expect(responseBodyJson).toHaveProperty('message', 'Bad request, email or password parameter is missing in POST request.');   
    expect(responseBodyJson).toHaveProperty('responseCode', 400);   
  });
  test("POST To Verify Login with valid details", async ({request}) => {
    const response  =  new LoginApi(request);
    const responseBody = await response.login(currentUser.password,currentUser.email);
    
   const responseBodyJson = await responseBody.json();
    expect(responseBodyJson).toHaveProperty('message', 'User exists!');   
    expect(responseBodyJson).toHaveProperty('responseCode', 200);   
  });
    test("POST To Verify Login with invalid details", async ({request}) => {
    const response  =  new LoginApi(request);
    const responseBody = await response.login(faker.internet.password(),faker.internet.email());
    
   const responseBodyJson = await responseBody.json();
    expect(responseBodyJson).toHaveProperty('message', 'User not found!');   
    expect(responseBodyJson).toHaveProperty('responseCode', 404);   
  });
})
test.describe('Delete test',()=>{
  test(" DELETE To Verify Login", async ({request}) => {
    const response  =  new LoginApi(request);
    const responseBody = await response.delete();

   const responseBodyJson = await responseBody.json();      
    expect(responseBodyJson).toHaveProperty('message', 'This request method is not supported.');   
    expect(responseBodyJson).toHaveProperty('responseCode', 405);   
  });

})