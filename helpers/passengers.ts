export const passengerOptions = Array.from({ length: 10 }, (_, index) => ({
  value: String(index + 1),
  label: `${index + 1} pasajero${index + 1 > 1 ? "s" : ""}`,
}));
