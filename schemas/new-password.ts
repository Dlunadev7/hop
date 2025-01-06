import * as Yup from 'yup';

const validationSchema = Yup.object({
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres.')
    .required('La contraseña es obligatoria.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas deben ser iguales.')
    .required('La confirmación de la contraseña es obligatoria.'),
});

export default validationSchema;
