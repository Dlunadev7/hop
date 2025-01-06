import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
export const stringToDate = (date: string): Date => {
  return dayjs(date, "DD/MM/YYYY").toDate();
};

export const dateToString = (date: Date): string => {
  return dayjs(date).format("DD/MM/YYYY");
};