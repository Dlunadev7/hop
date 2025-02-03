import * as Yup from 'yup';
import { i18NextType } from "@/utils/types/i18n.type";

export const validationSchema = (t: i18NextType) => Yup.object().shape({
  fullName: Yup.string().required(t("validations.booking.fullName", { ns: 'auth' })),
  contact: Yup.string().required(t("validations.booking.contact", { ns: 'auth' })),
  roomNumber: Yup.string().required(t("validations.booking.roomNumber", { ns: 'auth' })),
  numberOfPassengers: Yup.number().required(t("validations.booking.passengers", { ns: 'auth' })),
  numberOfLuggages: Yup.number().required(t("validations.booking.luggages", { ns: 'auth' })),
});

export const validationSchemaPickup = (t: i18NextType) => Yup.object().shape({
  fullName: Yup.string().required(t("validations.booking.fullName", { ns: 'auth' })),
  contact: Yup.string().required(t("validations.booking.contact", { ns: 'auth' })),
  // airline: Yup.string().required(t("validations.booking.airline", { ns: 'auth' })),
  flightNumber: Yup.string().required(t("validations.booking.flightNumber", { ns: 'auth' })),
  numberOfPassengers: Yup.number().required(t("validations.booking.passengers", { ns: 'auth' })),
  numberOfLuggages: Yup.number().required(t("validations.booking.luggages", { ns: 'auth' })),
});
