export type RegisterType = {
  email: string;
  password: string;
  role: string;
  userInfo: {
    firstName: string;
    lastName: string;
    rut: string;
    phone: string;
    user_address: {
      address: string;
      latitude: string;
      longitude: string;
    },
    bank_name: string;
    bank_account_holder: string;
    bank_account_type: string;
    bank_account_rut: string;
    bank_account: string;
    birthdate: string;
    hotel_address: {
      name: string;
      address: string,
      latitude: string,
      longitude: string,
    }
  };
}