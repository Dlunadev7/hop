import { travelTypeValues } from "@/utils/enum/travel.enum";

export const status: Record<travelTypeValues, string> = {
  PICKUP: "Pick Up",
  DROPOFF: "Drop Off",
  PROGRAMED: "Programmed",
  INSTANT: "Pick Up"
};

export const vehicleName: { [key: string]: string } = {
  SEDAN: "Sedan",
  VANS: "Van",
  ELECTRIC: "Electric Car",
};

export const reversedVehicleName: { [key: string]: string } = Object.fromEntries(
  Object.entries(vehicleName).map(([key, value]) => [value, key])
);
