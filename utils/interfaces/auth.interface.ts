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
  vehiclePictures: string[] | null;
  passengerInsurance: string | null;
}

export interface UserDocumentsPayload {
  frontRut: null;
  backRut: null;
  circulationPermit: null | {
    uri: string;
    name: string;
    type: string
  }[];
  seremiDecree: null | {
    uri: string;
    name: string;
    type: string
  }[];
  frontDriverLicense: null | {
    uri: string;
    name: string;
    type: string
  }[];
  backDriverLicense: null | {
    uri: string;
    name: string;
    type: string
  }[];
  driverResume: null | {
    uri: string;
    name: string;
    type: string
  }[];
  vehiclePictures: {
    uri: string;
    name: string;
    type: string
  }[];
  passengerInsurance: {
    uri: string;
    name: string;
    type: string
  }[];
}

export interface UserDocumentsPayload {
  frontRut: null;
  backRut: null;
  circulationPermit: null | {
    uri: string;
    name: string;
    type: string
  }[];
  seremiDecree: null | {
    uri: string;
    name: string;
    type: string
  }[];
  frontDriverLicense: null | {
    uri: string;
    name: string;
    type: string
  }[];
  backDriverLicense: null | {
    uri: string;
    name: string;
    type: string
  }[];
  driverResume: null | {
    uri: string;
    name: string;
    type: string
  }[];
  vehiclePictures: {
    uri: string;
    name: string;
    type: string
  }[];
  passengerInsurance: {
    uri: string;
    name: string;
    type: string
  }[];
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

interface HotelLocation {
  lat: number | string;
  lng: number | string;
  address: string;
}

export interface BankName {
  id: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: null;
  name: string;
  image?: string;
  country?: string;
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
  profilePic?: string;
  countryCode?: string;
  bank_account_isOwner: boolean;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: "USER_HOPPER" | string;
  userInfo: UserInfo;
  userNotificationToken?: string;
  isActive: boolean;
  isVerified: boolean;
}

export interface VehicleUser {
  type: string,
  passengers: string,
  accessibility: string,
  suitcases: string,
  specialLuggage: string
}