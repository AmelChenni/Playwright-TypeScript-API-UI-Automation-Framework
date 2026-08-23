import test, { expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/*google*ads***", (route) => route.abort());
  await page.route("**/*doubleclick***", (route) => route.abort());
});
test("Should match visual snapshot of Products Page", async ({ page }) => {
  await page.goto("/products");
  await expect(page).toHaveScreenshot("products-page1.png",{maxDiffPixelRatio: 0.05,animations: "disabled", mask: [page.locator(".carousel")],});
});