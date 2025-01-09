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

export interface UserInfo {
  bank_account: string;
  bank_account_holder: string;
  bank_account_rut: string;
  bank_account_type: string;
  bank_name: string;
  created_at: string;
  deleted_at: string | null;
  firstName: string;
  home_address: string;
  id: string;
  lastName: string;
  phone: string;
  profilePic: string | null;
  rut: string;
  updated_at: string;
}

export interface User {
  created_at: string;
  deleted_at: string | null;
  email: string;
  id: string;
  isActive: boolean;
  password: string;
  role: string;
  updated_at: string;
  userDocument: UserDocument;
  userInfo: UserInfo;
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
