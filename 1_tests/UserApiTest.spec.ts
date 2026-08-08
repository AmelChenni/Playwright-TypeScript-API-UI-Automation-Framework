import test, { expect } from "@playwright/test";
import UserApi from "../3_API/UserApi";
import { buildUserDetails, UserDetails } from "../4_Data/1-UserData";

test.describe("register", () => {
  test("POST To Create/Register User Account ", async ({ request }) => {
    const response = new UserApi(request);
    const newUser = buildUserDetails();
    const responseBody = await response.register(newUser);

    const responseBodyJson = await responseBody.json();
    expect(responseBodyJson).toHaveProperty("responseCode", 201);
    expect(responseBodyJson).toHaveProperty("message", "User created!");
  });
});

test.describe("Delete", () => {

  let userApi: UserApi;
  let currentUser: UserDetails;

  test.beforeEach(async ({ request }) => {
    userApi = new UserApi(request);
    currentUser = buildUserDetails(); 
    await userApi.register(currentUser);
  });
    test.afterEach(async ({ request }) => {
    await userApi.delete(currentUser.email,currentUser.password);
  });

  test("DELETE METHOD To Delete User Account ", async ({ request }) => {
    const response = new UserApi(request);
    const responseBody = await response.delete(currentUser.email,currentUser.password);
    const responseBodyJson = await responseBody.json();

    expect(responseBodyJson).toHaveProperty("responseCode", 200);
    expect(responseBodyJson).toHaveProperty("message", "Account deleted!");
  });
    test(" PUT METHOD To Update User Account ", async ({ request }) => {
      const updatedData = buildUserDetails({
      email: currentUser.email,
      password: currentUser.password,
      firstName: 'Updated FirstName',
      address1:"Updeted adress"
    });
    const response = new UserApi(request);
    const responseBody = await response.update(updatedData);

    const responseBodyJson = await responseBody.json();

    expect(responseBodyJson).toHaveProperty("responseCode", 200);
    expect(responseBodyJson).toHaveProperty("message", "User updated!");
  });
   test("GET user account detail by email ", async ({ request }) => {
    const response = new UserApi(request);
    
    const responseBody = await response.getUserDetails(currentUser.email);
    const responseBodyJson = await responseBody.json();

    expect(responseBodyJson).toHaveProperty("responseCode", 200);
  });
});