import { travelTypeValues } from "@/utils/enum/travel.enum";

export const status: Record<travelTypeValues, string> = {
  PICKUP: "Pick Up",
  DROPOFF: "Drop Off",
  PROGRAMED: "Programmed",
};

export const vehicleName: { [key: string]: string } = {
  SEDAN: "Sedan",
  VANS: "Van",
  ELECTRIC: "Electric Car",
};