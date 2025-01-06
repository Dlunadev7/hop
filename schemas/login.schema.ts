import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Por favor, ingresa un email válido.')
    .required('El email es obligatorio.'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres.')
    .required('La contraseña es obligatoria.'),
});

export default validationSchema;
