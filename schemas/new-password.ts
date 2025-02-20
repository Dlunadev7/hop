import { i18NextType } from '@/utils/types/i18n.type';
import * as Yup from 'yup';

const validationSchema = (t: i18NextType) => Yup.object({
  password: Yup.string()
    .min(6, t('new_password.password_min_length'))
    .required(t('new_password.password_required')),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], t('new_password.passwords_must_match'))
    .required(t('new_password.confirm_password_required')),
});

export default validationSchema;
