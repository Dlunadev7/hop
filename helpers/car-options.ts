import { ElectricCar, Sedan, Van } from "@/assets/svg";
import { i18NextType } from "@/utils/types/i18n.type";

export const carOptions = (t: i18NextType) => [
  {
    name: t("home.map_home.third_sheet.vehicle.sedan.title", { ns: "home" }),
    passengers: t("home.map_home.third_sheet.vehicle.sedan.passengers", {
      ns: "home",
    }),
    luggage: t("home.map_home.third_sheet.vehicle.sedan.luggage", {
      ns: "home",
    }),
    icon: Sedan,
    value: "SEDAN"
  },
  {
    name: t("home.map_home.third_sheet.vehicle.electric_car.title", {
      ns: "home",
    }),
    passengers: t(
      "home.map_home.third_sheet.vehicle.electric_car.passengers",
      {
        ns: "home",
      }
    ),
    luggage: t("home.map_home.third_sheet.vehicle.electric_car.luggage", {
      ns: "home",
    }),
    icon: ElectricCar,
    value: "ELECTRIC"
  },
  {
    name: t("home.map_home.third_sheet.vehicle.van.title", {
      ns: "home",
    }),
    passengers: t("home.map_home.third_sheet.vehicle.van.passengers", {
      ns: "home",
    }),
    luggage: t("home.map_home.third_sheet.vehicle.van.luggage", {
      ns: "home",
    }),
    icon: Van,
    value: "VANS"
  },
];
