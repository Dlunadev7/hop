import { paymentStatus } from "../enum/payment.enum";
import { travelTypeValues } from "../enum/travel.enum";
import { User } from "./auth.interface";

interface Location {
  latitude: number | null;
  longitude: number | null;
  address?: string | undefined;
}

export interface BookingData {
  countryCode: string;
  carType: any;
  vehicleType: string;
  programedTo: any;
  destination: Location;
  currentLocation: Location;
  fullName: string;
  contact: string;
  roomNumber: string;
  numberOfPassengers: number;
  numberOfLuggages: number;
  reducedMobility: boolean;
  flightNumber: string;
  airline: string;
  type: string;
  time: number | undefined;
  distance: number | undefined;
  price: number,
  hoppyCommission: number,
  id: string;
  hopperId: string
}

export interface BookingResponse {
  paymentStatus: paymentStatus;
  from: From;
  to: From;
  distance: number;
  time: number;
  type: travelTypeValues;
  programedTo: Date;
  status: string;
  passengerName: string;
  passengerContact: string;
  passengerRoom: string;
  totalPassengers: string;
  totalSuitCases: string;
  passengerAirline: string;
  passengerFligth: string;
  hoppy: Hoppy;
  price: number;
  vehicleType: string;
  id: string;
  hoppyCommission: number,
  passengerContactCountryCode: string;
  hopperCommission: number,
  hopper: User,
  appCommission: number;
  reducedMobility: boolean;
}

export interface From {
  lat: number;
  lng: number;
  address: string;
}

export interface Hoppy {
  id: string;
}

export interface BookingPagination {
  pagination: {
    total: number,
    page: number,
    totalPages: number,
    itemsPerPage: number,
    order: Order
  },
  result: BookingResponse[]
}

export type Order = {
  ASC: string;
  DESC: string;
}

export interface BookingResponseNotification {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  from: Location;
  to: Location;
  distance: number;
  time: number;
  type: string;
  programedTo: Date;
  status: string;
  passengerName: string;
  passengerContact: string;
  passengerContactCountryCode: string;
  passengerRoom: string;
  totalPassengers: string;
  totalSuitCases: string;
  passengerAirline: string;
  passengerFligth: string;
  hoppy: User;
  hoppyCommission: number;
  hoppyCommissionsPaid: boolean;
  hopper: User;
  hopperCommission: number;
  hopperCommissionsPaid: boolean;
  price: number;
  tolls: number | null;
  paymentStatus: string;
  vehicleType: string;
}


export interface FrecuentAddressInterface {
  mostFrequentFrom: MostFrequent[];
  mostFrequentTo: MostFrequent[];
}

export interface MostFrequent {
  address: string;
  lat: string;
  lng: string;
  count: string;
}
