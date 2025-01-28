import { i18NextType } from "@/utils/types/i18n.type";

export const documentationHopper = (t: i18NextType) => ([
  // {
  //   name: "licence",
  //   value: t("signup.step_3.fields.driver_licence"),
  //   type: "png",
  // },
  {
    name: "seremi",
    value: t("signup.step_3.fields.seremi"),
    type: "pdf"
  },
  {
    name: "curriculum_vitae",
    value: t("signup.step_3.fields.curriculum_vitae"),
    type: "pdf"
  },
  {
    name: "permission",
    value: t("signup.step_3.fields.permission"),
    type: "pdf"
  },
  {
    name: "secure",
    value: t("signup.step_3.fields.secure"),
    type: "pdf"
  },
  {
    name: "vehicle_picture",
    value: t("signup.step_3.fields.vehicle_picture"),
    type: "png",
    info: t("tooltip_description", { ns: 'utils' })
  }
])

/**
 *  "fields": {
      "driver_licence": "Driver's License Photos",
      "seremi": "Seremi Transport Decree",
      "curriculum_vitae": "Driver's Resume",
      "permission": "Valid Circulation Permit",
      "secure": "Passenger Insurance",
      "vehicle_picture": "Vehicle Photos"
    },
 */