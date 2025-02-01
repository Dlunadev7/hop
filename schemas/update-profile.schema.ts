import * as Yup from "yup";
import { i18NextType } from "@/utils/types/i18n.type";

export const validationSchema = (t: i18NextType) => Yup.object().shape({
  email: Yup.string()
    .email("Correo electrónico inválido")
    .required("Correo electrónico es requerido"),
  address: Yup.string().required("El domicilio es requerido"),
});