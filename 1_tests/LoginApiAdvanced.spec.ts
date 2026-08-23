// Register user
//       ↓
// Login with correct credentials
//       ↓
// Verify success
//       ↓
// Login  without email 
//       ↓
// Verify failure
//       ↓
// Login with wrong password
//       ↓
// Verify failure
//       ↓
// Cleanup

import test, { expect } from "@playwright/test";
import { buildUserDetails } from "../4_Data/1-UserData";
import UserApi from "../3_API/UserApi";
import LoginApi from "../3_API/LoginApi";
import { faker } from "@faker-js/faker";

test("API - Login positive and negative scenarios", async ({ request }) => {

    const userAPI = new UserApi(request);
    const newUser = buildUserDetails();
    const loginApi = new LoginApi(request)
    let isRegistered = false;

    
    try {
// Register user
    const firstResponse = await userAPI.register(newUser);
    const firstBody = await firstResponse.json();

    expect(firstResponse.status()).toBe(200);
    expect(firstBody).toHaveProperty("responseCode", 201);
    expect(firstBody).toHaveProperty("message", "User created!");

    isRegistered =true;
// Login with correct credentials

        const loginResponce = await loginApi.login(newUser.password,newUser.email)
        const loginResponceBody = await loginResponce.json()

    expect(loginResponce.status()).toBe(200);
    expect(loginResponceBody).toHaveProperty('message', 'User exists!');   
    expect(loginResponceBody).toHaveProperty('responseCode', 200);   
   
// Login without Email

        const loginResponceWrongE = await loginApi.login(newUser.password)
        const loginResponceWrongEBody = await loginResponceWrongE.json()

    expect(loginResponceWrongE.status()).toBe(200);
    expect(loginResponceWrongEBody).toHaveProperty('message', 'Bad request, email or password parameter is missing in POST request.');   
    expect(loginResponceWrongEBody).toHaveProperty('responseCode', 400);   
        

// Login with wrong password

        const loginResponceWrongP = await loginApi.login(faker.internet.password(),newUser.email)
        const loginResponceWrongPBody = await loginResponceWrongP.json()

    expect(loginResponceWrongP.status()).toBe(200);
    expect(loginResponceWrongPBody).toHaveProperty('message', 'User not found!');   
    expect(loginResponceWrongPBody).toHaveProperty('responseCode', 404);   
        


    } finally{
        if(isRegistered ){
      const deleteUser = await userAPI.delete(newUser.email, newUser.password);
      const deleteUserResponse = await deleteUser.json();

      expect(deleteUserResponse).toHaveProperty("responseCode", 200);
      expect(deleteUserResponse).toHaveProperty("message", "Account deleted!");

        }
        
    }

});