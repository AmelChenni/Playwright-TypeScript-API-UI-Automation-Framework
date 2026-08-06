import { APIRequestContext } from '@playwright/test';

export default class LoginApi{
constructor(
    readonly request :APIRequestContext
){}

async login(password: string, email?: string) {
    const formData: Record<string, string> = { password };
    if (email !== undefined) {
    formData.email = email;
  }

    const response = await this.request.post('/api/verifyLogin', { form: formData });
    return response;
}
async delete(password?: string, email?: string) {
    const formData: Record<string, string> = { };
    if (email !== undefined) {
    formData.email = email;
  }   if (password !== undefined) {
    formData.password = password;
  }

    const response = await this.request.delete('/api/verifyLogin', { form: formData });
    return response;
}

}




