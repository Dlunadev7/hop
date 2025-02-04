function cleanRut(rut: string): string {
  /**
   * Delete all non-numeric characters from a RUT.
   * @param rut  RUT string
   * @return {string} RUT without non-numeric characters.
   */
  return typeof rut === "string"
    ? rut.replace(/^0+|[^0-9kK]+/g, "").toUpperCase()
    : "";
}

export function validateRut(rut: string): boolean {
  /**
   * Verify if a RUT is valid.
   * @param rut  RUT string
   * @return {boolean} true if RUT is valid, false otherwise.
   */
  if (/^0+/.test(rut)) {
    return false;
  }
  if (!/^0*(\d{1,3}(\.?\d{3})*)-?([\dkK])$/.test(rut)) {
    return false;
  }
  const cleanedRut = cleanRut(rut);

  let rutNumbers = parseInt(cleanedRut.slice(0, -1), 10);
  const rutLastDigit = cleanedRut.slice(-1);
  let M = 0,
    S = 1;
  for (; rutNumbers; rutNumbers = Math.floor(rutNumbers / 10))
    S = (S + (rutNumbers % 10) * (9 - (M++ % 6))) % 11;
  const lastDigitValid = (S ? S - 1 : "K").toString();
  return lastDigitValid === rutLastDigit;
}

export const formatRut = (rut: string) => {
  let cleanedRut = cleanRut(rut);

  if (cleanedRut.length < 7) return cleanedRut;

  let body = cleanedRut.slice(0, -1);
  let dv = cleanedRut.slice(-1);

  body = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${body}-${dv}`;
};