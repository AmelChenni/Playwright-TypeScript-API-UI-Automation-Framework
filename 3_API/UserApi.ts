import { APIRequestContext } from '@playwright/test';
import { UserDetails } from '../4_Data/1-UserData';

export default class UserApi{
constructor(
    readonly request :APIRequestContext
){}

async register(data:UserDetails) {

    const formData: Record<string, string> = {
      name: data.name,
      email: data.email,
      password: data.password,
      title: data.gender || 'Mr',
      birth_date: data.day,
      birth_month: data.month,
      birth_year: data.year,
      firstname: data.firstName,
      lastname: data.lastName,
      company: '',
      address1: data.address1,
      address2: '',
      country: data.country,
      zipcode: data.zipcode,
      state: data.state,
      city: data.city,
      mobile_number: data.mobile,
    };
    
    const response = await this.request.post('/api/createAccount', { form: formData });
    return response;
}

async delete(email: string,password: string) {
    const formData: Record<string, string> = { email,password};
    const response = await this.request.delete('/api/deleteAccount', { form: formData });
    return response;
}
async update(data:UserDetails) {

    const formData: Record<string, string> = {
      name: data.name,
      email: data.email,
      password: data.password,
      title: data.gender || 'Mr',
      birth_date: data.day,
      birth_month: data.month,
      birth_year: data.year,
      firstname: data.firstName,
      lastname: data.lastName,
      company: '',
      address1: data.address1,
      address2: '',
      country: data.country,
      zipcode: data.zipcode,
      state: data.state,
      city: data.city,
      mobile_number: data.mobile,
    };
    
    const response = await this.request.put('/api/updateAccount', { form: formData });
    return response;
}
async getUserDetails(userEmail: string) {
    const response = await this.request.get('/api/getUserDetailByEmail',{
          params: { email: userEmail }  
    } 
  );
    return response;
}
}




