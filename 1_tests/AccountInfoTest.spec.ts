import { expect, test } from "../5_Fixtures/3_AccountInfoFixture";
import { buildUserDetails, UserDetails } from "../4_Data/1-UserData";
import AccountCreatedPage from "../2_Pages/5_AccountCreatedPage";
import { faker } from "@faker-js/faker";

const userPassword = [faker.internet.password({ length: 10 }), "123", "a"];
test.describe("Positive Tests", () => {
  for (const pass of userPassword) {
    test(`should allow account creation regardless of password length ${pass.length}`, async ({
      page,
      AccountInfoPage,
    }) => {
      const userDetails = buildUserDetails({ password: pass });
      await AccountInfoPage.fillAccountDetails(userDetails);
      await expect(page).toHaveURL("/account_created");
      const AccountPage = new AccountCreatedPage(page);
      await expect(AccountPage.text).toHaveText("Account Created!");
      await AccountPage.contuneButtonClick();
      await expect(page).toHaveURL("");
    });
  }
});

test.describe("Negative Tests", () => {
  test("should get a HTML validation error if password empty", async ({
    AccountInfoPage,
  }) => {
    const userDetails = buildUserDetails({ password: "" });
    await AccountInfoPage.fillAccountDetails(userDetails);

    expect(
      await AccountInfoPage.getHTMLValidationError(AccountInfoPage.passwordInput),
    ).toContain("out this field");
  });
  test("should get a HTML validation error if first name empty", async ({
    AccountInfoPage,
  }) => {
    const userDetails = buildUserDetails({ firstName: "" });
    await AccountInfoPage.fillAccountDetails(userDetails);

    expect(
      await AccountInfoPage.getHTMLValidationError(
        AccountInfoPage.firstNameInput,
      ),
    ).toContain("out this field");
  });
  test("should get a HTML validation error if last name empty", async ({
    AccountInfoPage,
  }) => {
    const userDetails = buildUserDetails({ lastName: "" });
    await AccountInfoPage.fillAccountDetails(userDetails);

    expect(
      await AccountInfoPage.getHTMLValidationError(AccountInfoPage.lastNameInput),
    ).toContain("out this field");
  });
});
