
export const luggageOptions = Array.from({ length: 10 }, (_, index) => ({
  value: String(index + 1),
  label: `${index + 1} maleta${index + 1 > 1 ? "s" : ""}`,
}));
