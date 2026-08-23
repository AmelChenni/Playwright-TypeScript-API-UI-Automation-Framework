import { test, expect } from "@playwright/test";
import * as cheerio from "cheerio";
import Products from "../2_Pages/6_ProductsPage";

test.describe("API & Route Intercepting Tests", () => {

  test("1. Mocking Product List - Fake Product Displayed", async ({ page }) => {
    await page.route("**/products", async (route) => {
      const response = await route.fetch();
      let body = await response.text();
      body = body.replace(/Blue Top/g, "Custom Mocked Laptop");

      await route.fulfill({
        response,
        body,
      });
    });

    await page.goto("/products");
    await expect(page.getByText("Custom Mocked Laptop").first()).toBeVisible();
  });

  test("2. Mocking Product List - Empty Product Displayed", async ({ page }) => {
    await page.route("**/products", async (route) => {
      const response = await route.fetch();
      const html = await response.text();

      const $ = cheerio.load(html);
      $(".features_items").empty();

      await route.fulfill({
        response,
        body: $.html(),
      });
    });

    await page.goto("/products", { waitUntil: "domcontentloaded" });
    const products = new Products(page);
    const allProducts = await products.getAllProductsExist();
    expect(allProducts).toHaveLength(0);
  });

  test("3. Mocking Server Error - Custom HTML Error Page", async ({ page }) => {
    await page.route("**/products", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "text/html",
        body: "<h1>500 Internal Server Error</h1><p>Database Connection Failed</p>",
      });
    });

    const response = await page.goto("/products");

    expect(response?.status()).toBe(500);
    await expect(page.locator("h1")).toHaveText("500 Internal Server Error");
  });

  test("4. Mocking API Error Response (JSON)", async ({ page }) => {
    await page.route("**/products", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "Bad Request", message: "Invalid parameters" }),
      });
    });

    const response = await page.goto("/products");

    expect(response?.status()).toBe(400);

    const errorMsg = page.locator("body pre");
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText("Bad Request");
  });

test("Should handle network failure and show offline state", async ({ page }) => {
  await page.route("**/products", async (route) => {
    await route.abort("failed");
  });

  let networkErrorThrown = false;
  await page.goto("/products").catch((error) => {
    networkErrorThrown = true;
    // console.log("Network error caught successfully:", error.message);
  });

  expect(networkErrorThrown).toBe(true);
  const pageTitle = await page.title();
  expect(pageTitle).toBe(""); 
});

});