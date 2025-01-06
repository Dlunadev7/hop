import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Por favor, ingresa un email válido.')
    .required('El email es obligatorio.'),
});

export default validationSchema;
