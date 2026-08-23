// Register user
//      ↓
// isRegistered = true
//      ↓
// Register same user
//      ↓
// Expect rejection
//      ↓
// finally
//      ↓
// Delete user
import test, { expect } from "@playwright/test";
import { buildUserDetails } from "../4_Data/1-UserData";
import UserApi from "../3_API/UserApi";

test("API - should reject duplicate user registration", async ({ request }) => {

    const userAPI = new UserApi(request);
    const newUser = buildUserDetails();
    let isRegistered = false;

    
    try {
    const firstResponse = await userAPI.register(newUser);
    const firstBody = await firstResponse.json();

    expect(firstResponse.status()).toBe(200);
    expect(firstBody).toHaveProperty("responseCode", 201);
    expect(firstBody).toHaveProperty("message", "User created!");

    isRegistered =true;
    // Second registration - SAME USER
    const duplicateResponse = await userAPI.register(newUser);
    const duplicateBody = await duplicateResponse.json();

    // check    
    expect(duplicateResponse.status()).toBe(200);
    expect(duplicateBody).toHaveProperty("responseCode", 400);
    expect(duplicateBody).toHaveProperty("message", 'Email already exists!');
    
        
    } finally{
        if(isRegistered ){
      const deleteUser = await userAPI.delete(newUser.email, newUser.password);
      const deleteUserResponse = await deleteUser.json();

      expect(deleteUserResponse).toHaveProperty("responseCode", 200);
      expect(deleteUserResponse).toHaveProperty("message", "Account deleted!");

        }
        
    }

});