import test, { expect } from "@playwright/test";
import ProductsApi from "../3_API/ProductsApi";

test.describe("products", () => {
  test("Get All Products List ", async ({ request }) => {
    const response = new ProductsApi(request);
    const responseBody = await response.getProducts();

    const responseBodyJson = await responseBody.json();
    const productsList = await responseBodyJson.products;

    expect(responseBodyJson).toHaveProperty("responseCode", 200);
    expect(Array.isArray(productsList)).toBe(true);
    expect(productsList.length).toBeGreaterThan(0);

    const firstProduct = productsList[0];
    expect(firstProduct).toHaveProperty('id');
    expect(firstProduct).toHaveProperty('name');
    expect(firstProduct).toHaveProperty('price');
    expect(firstProduct).toHaveProperty('brand');
  });

  test(" POST To All Products List ", async ({ request }) => {
    const response = new ProductsApi(request);
    const responseBody = await response.postProducts();

    const responseBodyJson = await responseBody.json();
    console.log(await responseBodyJson);

    expect(responseBodyJson).toHaveProperty("responseCode", 405);
    expect(responseBodyJson).toHaveProperty("message", "This request method is not supported.");
  });
   test("Get All Brands List", async ({ request }) => {
    const response = new ProductsApi(request);
    const responseBody = await response.getBrands();

    const responseBodyJson = await responseBody.json();
    const brandsList = await responseBodyJson.brands;
    expect(responseBodyJson).toHaveProperty("responseCode", 200);
    

    expect(Array.isArray(brandsList)).toBe(true);
    expect(brandsList.length).toBeGreaterThan(0);
    expect(brandsList[0]).toHaveProperty('brand');
  });
   test("PUT To All Brands List", async ({ request }) => {
    const response = new ProductsApi(request);
    const responseBody = await response.putBrands();

    const responseBodyJson = await responseBody.json();
    expect(responseBodyJson).toHaveProperty("responseCode", 405);
    expect(responseBodyJson).toHaveProperty("message", "This request method is not supported.");
  });
    test("POST To Search Product", async ({ request }) => {
    const response = new ProductsApi(request);
    const searchTerm = "Top"
    const responseBody = await response.searchProduct(searchTerm);

    const responseBodyJson = await responseBody.json();
    
    expect(responseBodyJson).toHaveProperty("responseCode", 200);

    const products = await responseBodyJson.products;
    expect(products.length).toBeGreaterThan(0);    

    const matches = products.some((p: any) => 
      p.name.toLowerCase().includes(searchTerm.toLocaleLowerCase()) 
    );
    expect(matches).toBe(true);
 });

      test("POST To Search Product without search_product parameter", async ({ request }) => {
    const response = new ProductsApi(request);
    const responseBody = await response.searchProductWithoutSearch();

    const responseBodyJson = await responseBody.json();
    
    expect(responseBodyJson).toHaveProperty("responseCode", 400);
    expect(responseBodyJson).toHaveProperty("message", "Bad request, search_product parameter is missing in POST request.");
  });
});
