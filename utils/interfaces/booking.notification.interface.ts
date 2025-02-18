import { paymentStatus } from "../enum/payment.enum";
import { userRoles } from "../enum/role.enum";
import { travelStatus } from "../enum/travel.enum";

interface Travel {
  created_at: string;
  deleted_at: string | null;
  distance: number;
  from: {
    latitude: string;
    longitude: string;
    address: string;
  }; // Reemplazar con una interfaz adecuada si se conoce la estructura
  hopperCommission: number;
  hopperCommissionsPaid: boolean;
  hoppy: object; // Reemplazar con una interfaz adecuada si se conoce la estructura
  hoppyCommission: number;
  hoppyCommissionsPaid: boolean;
  id: string;
  passengerAirline: string;
  passengerContact: string;
  passengerContactCountryCode: string;
  passengerFligth: string;
  passengerName: string;
  passengerRoom: string;
  paymentStatus: paymentStatus; // Ajustar según estados posibles
  price: number;
  programedTo: Date;
  status: travelStatus; // Ajustar según estados posibles
  time: number;
  to: {
    latitude: string;
    longitude: string;
    address: string;
  }; // Reemplazar con una interfaz adecuada si se conoce la estructura
  tolls: string | null;
  totalPassengers: string;
  totalSuitCases: string;
  type: "PROGRAMED" | "INSTANT"; // Ajustar según tipos posibles
  updated_at: string;
  vehicleType: string;
}

interface UserInfo {
  bank_account: string;
  bank_account_holder: string;
  bank_account_rut: string;
  bank_account_type: string;
  countryCode: string;
  created_at: string;
  deleted_at: string | null;
  firstName: string;
  home_address: object; // Reemplazar con una interfaz adecuada si se conoce la estructura
  hotel_location: object; // Reemplazar con una interfaz adecuada si se conoce la estructura
  hotel_name: string;
  id: string;
  lastName: string;
  phone: string;
  profilePic: string;
  rut: string;
  updated_at: string;
}

interface User {
  created_at: string;
  deleted_at: string | null;
  email: string;
  id: string;
  isActive: boolean;
  isVerified: boolean;
  role: userRoles;
  updated_at: string;
  userInfo: UserInfo;
  userNotificationToken: string;
}

interface Metadata {
  travel: Travel;
}

export enum notificationTypeValues {
  HOPPER_CANCELLED = 'HOPPER_CANCELLED',
  HOPPY_CANCELLED = 'HOPPY_CANCELLED',
  USER_COMPLETE_TRAVEL = 'USER_COMPLETED_TRAVEL',
  HOPPER_ACCEPT_TRAVEL = 'HOPPER_ACCEPT_TRAVEL',
  COMMISSIONS = 'COMMISSIONS',
  DEPOSIT_RECEIVED = 'DEPOSIT_RECEIVED',
  HOPPER_IN_SITE = 'HOPPER_IN_SITE',
  TRAVEL_CHANGE = 'TRAVEL_CHANGE',
  NEW_TRAVEL = 'NEW_TRAVEL',
}

export interface TravelNotification {
  alreadySeen: boolean;
  created_at: string;
  deleted_at: string | null;
  id: string;
  metadata: Metadata;
  type: notificationTypeValues;
  updated_at: string;
  user: User;
}
export interface TravelData {
  pagination: {
    itemsPerPage: number;
    order: string;
    page: number;
    total: number;
    totalPages: number;
  },
  result: TravelNotification[]
}
