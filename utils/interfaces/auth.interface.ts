export interface SignInResponse {
  access_token: string;
  refresh_token: string;
  role: string
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface UserDocument {
  backDriverLicense: string | null;
  backRut: string | null;
  circulationPermit: string | null;
  created_at: string;
  deleted_at: string | null;
  driverResume: string | null;
  frontDriverLicense: string | null;
  frontRut: string | null;
  id: string;
  seremiDecree: string | null;
  updated_at: string;
  vehiclePictures: string | null;
}

export interface CreateUserResponse {
  bank_account: string;
  bank_account_type: string;
  bank_name: string;
  firstName: string;
  home_address: string;
  lastName: string;
  phone: string;
  rut: string;
}

interface HomeAddress {
  lat: number | string;
  lng: number | string;
  address: string;
}

interface BankName {
  id: string;
  name: string;
}

interface HotelLocation {
  lat: number | string;
  lng: number | string;
  address: string;
}

export interface UserInfo {
  firstName?: string;
  lastName?: string;
  rut?: string;
  phone?: string;
  home_address?: HomeAddress;
  bank_account_holder: string;
  bank_account_rut: string;
  bank_name?: BankName;
  bank_account?: string;
  bank_account_type?: string;
  hotel_name?: string;
  hotel_location?: HotelLocation;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: "USER_HOPPER" | string;
  userInfo: UserInfo;
}
