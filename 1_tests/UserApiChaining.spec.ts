// Register **
//    ↓
// Get      **
//    ↓
// Update   **
//    ↓
// Get      **
//    ↓
// Verify changed data **
//    ↓
// Delete **
//    ↓
// Verify deletion **

import test, { expect } from "@playwright/test";
import { buildUserDetails } from "../4_Data/1-UserData";
import UserApi from "../3_API/UserApi";

// Verify user exists
test("API chaining - Register user then get user details", async ({
  request,
}) => {
        // new user
    const userAPI = new UserApi(request);
  const newUser = buildUserDetails();
  const updatedUser = buildUserDetails({
    email: newUser.email,
    password: newUser.password,
    firstName: "Updated FirstName",
    address1: "Updeted adress",
  });
  let isRegistered =false;

  try {

    // register
    const registerResponse = await userAPI.register(newUser);
    const registerResponseBody = await registerResponse.json();
    expect(registerResponse.status()).toBe(200);

    expect(registerResponseBody).toHaveProperty("responseCode", 201);
    expect(registerResponseBody).toHaveProperty("message", "User created!");
    isRegistered = true;
    // Get User
    const userDetails = await userAPI.getUserDetails(newUser.email);
    const userDetailsResponse = await userDetails.json();
    expect(userDetails.status()).toBe(200);

    expect(userDetailsResponse).toHaveProperty("responseCode", 200);

    expect(userDetailsResponse.user.email).toEqual(newUser.email);
    expect(userDetailsResponse.user.name).toEqual(newUser.name);
    expect(userDetailsResponse.user.address1).toEqual(newUser.address1);

    // Update
    const updateResponse = await userAPI.update(updatedUser);
    const updateResponseBody = await updateResponse.json();
    expect(updateResponse.status()).toBe(200);

    expect(updateResponseBody).toHaveProperty("responseCode", 200);
    expect(updateResponseBody).toHaveProperty("message", "User updated!");

    // Get User
    const updatedUserDetails = await userAPI.getUserDetails(newUser.email);
    const useUpdatedResponse = await updatedUserDetails.json();
    expect(updatedUserDetails.status()).toBe(200);

    expect(useUpdatedResponse).toHaveProperty("responseCode", 200);
    expect(useUpdatedResponse.user.email).toEqual(updatedUser.email);
    expect(useUpdatedResponse.user.name).toEqual(updatedUser.name);

    // Verify changed data
    expect(updatedUser.firstName).toEqual(useUpdatedResponse.user.first_name);
    expect(updatedUser.address1).toEqual(useUpdatedResponse.user.address1);
    expect(updatedUser.email).toEqual(useUpdatedResponse.user.email);
    } finally {
  if (isRegistered) {
      // 5. Delete User 
      const deleteUser = await userAPI.delete(updatedUser.email, updatedUser.password);
      const deleteUserResponse = await deleteUser.json();

      expect(deleteUserResponse).toHaveProperty("responseCode", 200);
      expect(deleteUserResponse).toHaveProperty("message", "Account deleted!");

      // 6. Verify Deletion
      const deletedDetails = await userAPI.getUserDetails(updatedUser.email);
      const deletedDetailsResponse = await deletedDetails.json();

      expect(deletedDetailsResponse).toHaveProperty("responseCode", 404);
      expect(deletedDetailsResponse).toHaveProperty(
        "message",
        "Account not found with this email, try another email!"
      );
    }
    }
  
});
