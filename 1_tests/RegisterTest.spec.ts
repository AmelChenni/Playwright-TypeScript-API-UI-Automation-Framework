import { expect, test } from "../5_Fixtures/2_SignupFixture";
import { faker } from "@faker-js/faker";

test.describe("New User Signup!-Positive Tests", () => {
  test("should get the signup page if email and password correct", async ({
    registerLoginPage,
    page,
  }) => {
    await registerLoginPage.signup(
      faker.person.fullName(),
      faker.internet.email(),
    );
    await expect(page).toHaveURL("/signup");
  });
});

test.describe("New User Signup!-Negative Tests", () => {
  const dataInfo = [
    {
      title: "should get error if email not correct",
      name: faker.person.fullName(),
      email: "chenniamel",
      field :"email"
    },
    {
      title: "should get error if email empty",
      name: faker.person.fullName(),
      email: "",
      field :"email"
    },
     {
      title: "should get error if email exist",
      name: faker.person.fullName(),
      email: "amel@gmail.com",
      field :"email exist"
    },
        {
      title: "should get error if name empty",
      name: "",
      email: faker.internet.email(),
      field :"name"
    },
  ];

  for (const data of dataInfo) {
    test(data.title, async ({ registerLoginPage }) => {
      await registerLoginPage.signup(data.name, data.email);
      let  htmlErrorValidation;
        if(data.field==="name"){
       htmlErrorValidation  =
        await registerLoginPage.getHTMLValidationError(
          registerLoginPage.signupName)      
        }else if(data.field==="email exist"){
               htmlErrorValidation =await registerLoginPage.getSignupEmailError();
        }else{
               htmlErrorValidation =
        await registerLoginPage.getHTMLValidationError(
          registerLoginPage.signupEmail);
        }
      expect(htmlErrorValidation).toBeTruthy();
    });
  }
});
