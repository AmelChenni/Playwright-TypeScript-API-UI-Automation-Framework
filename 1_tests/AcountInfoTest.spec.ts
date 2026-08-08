import { expect, test } from "../5_Fixtures/3_AcountInfoFixture";
import { buildUserDetails, UserDetails } from "../4_Data/1-UserData";
import AcountCreatedPage from "../2_Pages/5_AcountCreatedPage";
import { faker } from "@faker-js/faker";
import Products from "../2_Pages/6_ProductsPage";

const userPassword = [faker.internet.password({ length: 10 }), "123", "a"];
test.describe("Positive Tests", () => {
  for (const pass of userPassword) {
    test(`should allow account creation regardless of password length ${pass.length}`, async ({
      page,
      acountInfoPage,
    }) => {
      const userDetails = buildUserDetails({ password: pass });
      await acountInfoPage.fillAccountDetails(userDetails);
      await expect(page).toHaveURL("/account_created");
      const acountCreatedPage = new AcountCreatedPage(page);
      await expect(acountCreatedPage.text).toHaveText("Account Created!");
      await acountCreatedPage.contuneButtonClick();
      await expect(page).toHaveURL("");
    });
  }
});

test.describe("Negative Tests", () => {
  test("should get a HTML validation error if password empty", async ({
    acountInfoPage,
  }) => {
    const userDetails = buildUserDetails({ password: "" });
    await acountInfoPage.fillAccountDetails(userDetails);

    expect(
      await acountInfoPage.getHTMLValidationError(acountInfoPage.passwordInput),
    ).toContain("out this field");
  });
  test("should get a HTML validation error if first name empty", async ({
    acountInfoPage,
  }) => {
    const userDetails = buildUserDetails({ firstName: "" });
    await acountInfoPage.fillAccountDetails(userDetails);

    expect(
      await acountInfoPage.getHTMLValidationError(
        acountInfoPage.firstNameInput,
      ),
    ).toContain("out this field");
  });
  test("should get a HTML validation error if last name empty", async ({
    acountInfoPage,
  }) => {
    const userDetails = buildUserDetails({ lastName: "" });
    await acountInfoPage.fillAccountDetails(userDetails);

    expect(
      await acountInfoPage.getHTMLValidationError(acountInfoPage.lastNameInput),
    ).toContain("out this field");
  });
});
