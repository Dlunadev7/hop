import { travelTypeValues } from "../enum/travel.enum";

interface Location {
  latitude: number | null;
  longitude: number | null;
  address?: string;
}

export interface BookingData {
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
}

export interface BookingResponse {
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
  hopperCommission: number,
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