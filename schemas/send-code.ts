import { i18NextType } from '@/utils/types/i18n.type';
import * as Yup from 'yup';

const validationSchema = (t: i18NextType) => Yup.object({
  email: Yup.string()
    .email(t('validations.signin.email.invalid', { ns: 'auth' }))
    .required(t('validations.signin.email.required', { ns: 'auth' })),
});

export default validationSchema;
