export enum City {
  CAIRO = 'CAIRO',
  ZATOUN = 'ZATOUN',
  HAWAMDEIA = 'HAWAMDEIA',
  MARG = 'MARG',
}

export default interface User {
  _id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: City;
}
