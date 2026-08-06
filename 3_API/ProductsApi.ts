import { APIRequestContext } from '@playwright/test';

export default class ProductsApi{
constructor(
    readonly request :APIRequestContext
){}

async getProducts() {
    const response = await this.request.get('/api/productsList');
    return response;
}
async postProducts() {
    const response = await this.request.post('/api/productsList');
    return response;
}
async getBrands() {
    const response = await this.request.get('/api/brandsList');
    return response;
}
async putBrands() {
    const response = await this.request.put('/api/brandsList');
    return response;
}
async searchProduct(search_product:string) {
    const formData: Record<string, string> = {search_product};
    const response = await this.request.post('/api/searchProduct', { form: formData });
    return response;
}
async searchProductWithoutSearch() {
    const response = await this.request.post('/api/searchProduct');
    return response;
}
}




