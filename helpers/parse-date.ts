import dayjs from "dayjs";

export const formattedDate = (date: Date) => ({
  date: dayjs(date).utc(false).format("DD MMM. YYYY"),
  time: dayjs(date).utc(false).format("HH:mm A"),
});