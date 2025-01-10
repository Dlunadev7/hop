import { i18NextType } from "@/utils/types/i18n.type";
import * as Yup from "yup";

export const validationSchema = (t: i18NextType) => Yup.object().shape({
  firstName: Yup.string()
    .min(2, t("validations.signup.firstName.min_length", { ns: 'auth' }))
    .max(20, t("validations.signup.firstName.max_length", { ns: 'auth' }))
    .required(t("validations.signup.firstName.required", { ns: 'auth' })),

  lastName: Yup.string()
    .min(2, t("validations.signup.lastName.min_length", { ns: 'auth' }))
    .max(20, t("validations.signup.lastName.max_length", { ns: 'auth' }))
    .required(t("validations.signup.lastName.required", { ns: 'auth' })),

  password: Yup.string()
    .min(8, t('validations.signup.password.min_length', { ns: 'auth' }))
    .required(t('validations.signup.password.required', { ns: 'auth' })),

  email: Yup.string()
    .email(t("validations.signup.email.invalid", { ns: 'auth' }))
    .required(t("validations.signup.email.required", { ns: 'auth' })),

  rut: Yup.string()
    .length(12, t("validations.signup.rut.length", { ns: 'auth' }))
    .matches(/^\d{12}$/, t("validations.signup.rut.format", { ns: 'auth' }))
    .required(t("validations.signup.rut.required", { ns: 'auth' })),

  address: Yup.string()
    .min(2, t("validations.signup.address.min_length", { ns: 'auth' }))
    .max(50, t("validations.signup.address.max_length", { ns: 'auth' }))
    .required(t("validations.signup.address.required", { ns: 'auth' })),

  birthDate: Yup.string()
    .required(t("validations.signup.birthDate.required", { ns: 'auth' })),
});


export const validationSchemaS1 = (t: i18NextType) => Yup.object().shape({
  bank_account_holder: Yup.string()
    .required(t("validations.step_2.bank_account_holder.required", { ns: 'auth' }))
    .min(3, t("validations.step_2.bank_account_holder.min_length", { ns: 'auth' })),

  bank_name: Yup.string()
    .required(t("validations.step_2.bank_name.required", { ns: 'auth' }))
    .min(3, t("validations.step_2.bank_name.min_length", { ns: 'auth' })),

  bank_account: Yup.string()
    .required(t("validations.step_2.bank_account_number.required", { ns: 'auth' }))
    .min(10, t("validations.step_2.bank_account_number.min_length", { ns: 'auth' })),

  bank_account_type: Yup.string()
    .required(t("validations.step_2.bank_account_type.required", { ns: 'auth' })),
  bank_account_rut: Yup.string()
    .required(t("validations.step_2.bank_account_rut.required", { ns: 'auth' }))

})

export const validationSchemaS3 = Yup.object().shape({
  bank_name: Yup.string()
    .min(2, "Hotel name must be at least 2 characters.")
    .max(20, "Hotel name cannot exceed 20 characters.")
    .required("Hotel name is required."),

  home_address: Yup.string()
    .required("Address is required."),
})