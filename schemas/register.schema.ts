import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters.")
    .max(20, "First name cannot exceed 20 characters.")
    .required("First name is required."),

  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters.")
    .max(20, "Last name cannot exceed 20 characters.")
    .required("Last name is required."),

  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres.')
    .required('La contraseña es obligatoria.'),

  email: Yup.string()
    .email("Invalid email format.")
    .required("Email is required."),

  rut: Yup.string()
    .length(12, "RUT must be exactly 12 characters.")
    .matches(/^\d{12}$/, "RUT must be a valid 12-digit number.")
    .required("RUT is required."),

  address: Yup.string()
    .min(2, "Address must be at least 2 characters.")
    .max(50, "Address cannot exceed 50 characters.")
    .required("Address is required."),

  birthDate: Yup.string()
    .required("Birth date is required."),
});

export const validationSchemaS1 = Yup.object().shape({
  bank_account_holder: Yup.string()
    .required('El titular de la cuenta es obligatorio')
    .min(3, 'El titular de la cuenta debe tener al menos 3 caracteres'),

  bank_name: Yup.string()
    .required('El nombre del banco es obligatorio')
    .min(3, 'El nombre del banco debe tener al menos 3 caracteres'),

  bank_account: Yup.string()
    .required('El número de la cuenta es obligatorio')
    .min(10, 'El número de cuenta debe tener al menos 10 caracteres'),

  bank_account_type: Yup.string()
    .required('El tipo de cuenta es obligatorio'),
  bank_account_rut: Yup.string()
    .required('El RUT del titular es obligatorio')

})

export const validationSchemaS3 = Yup.object().shape({
  bank_name: Yup.string()
    .min(2, "Hotel name must be at least 2 characters.")
    .max(20, "Hotel name cannot exceed 20 characters.")
    .required("Hotel name is required."),

  home_address: Yup.string()
    .required("Address is required."),
})