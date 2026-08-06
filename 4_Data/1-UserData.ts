import { faker } from '@faker-js/faker';

export interface UserDetails {
    name: string;         
    email: string;             
    gender?: 'Mr' | 'Mrs' | '';
    password: string;
    day: string;
    month: string;
    year: string;
    newsletter?: boolean;
    specialOffers?: boolean;
    firstName: string;
    lastName: string;
    address1: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobile: string;
}

export function buildUserDetails(overrides: Partial<UserDetails> = {}): UserDetails {
    const name= faker.person.fullName();
  const email= faker.internet.email();

  return {
        name: name,
        email: email,
        gender: 'Mrs',
        password: faker.internet.password({ length: 10 }),
        day: '15',
        month: 'March',
        year: '1995',
        newsletter: true,
        specialOffers: true,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        address1: faker.location.streetAddress(),
        country: 'United States',
        state: faker.location.state(),
        city: faker.location.city(),
        zipcode: faker.location.zipCode(),
        mobile: faker.phone.number(),
        ...overrides,
    };
}