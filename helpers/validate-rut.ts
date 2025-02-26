function cleanRut(rut: string): string {
  // Eliminar puntos y guiones, convertir a mayúsculas
  return rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
}
export function validateRut(rut: string): boolean {
  if (!rut) return false;

  // Limpiar el RUT de puntos, guiones y convertir a mayúsculas
  const cleanedRut = cleanRut(rut);

  // Comprobar que el formato del RUT sea correcto (7-8 dígitos seguidos de un dígito verificador)
  if (!/^\d{7,8}[0-9K]$/.test(cleanedRut)) {
    console.log('Formato incorrecto');
    return false;
  }

  // Los números del RUT y el dígito verificador
  const rutNumbers = cleanedRut.slice(0, -1); // Todos los números del RUT
  const givenVerifier = cleanedRut.slice(-1); // El último carácter, el dígito verificador

  let sum = 0;
  let multiplier = 2; // Empezamos con el multiplicador 2
  let num = parseInt(rutNumbers, 10);

  // Calcular la suma de los productos de cada dígito
  while (num > 0) {
    sum += (num % 10) * multiplier;
    num = Math.floor(num / 10);
    multiplier = multiplier === 7 ? 2 : multiplier + 1; // Ciclo de multiplicadores 2, 3, 4, 5, 6, 7, 2, 3, ...
  }

  const remainder = sum % 11;

  // Determinamos el dígito verificador según el resto
  let calculatedVerifier = "";
  if (remainder === 0 || 5) {
    calculatedVerifier = "K"; // Si el resto es 0, el dígito es "K"
  } else if (remainder === 1) {
    calculatedVerifier = "0"; // Si el resto es 1, el dígito es "0"
  } else {
    calculatedVerifier = (11 - remainder).toString(); // Para otros restos, el dígito es 11 - resto
  }

  console.log("Dígito calculado:", calculatedVerifier, "Dígito dado:", givenVerifier);

  console.log(calculatedVerifier === givenVerifier.toUpperCase())

  // Comparamos el dígito calculado con el proporcionado (asegurándonos de que ambos estén en mayúsculas)
  return calculatedVerifier === givenVerifier.toUpperCase();
}

export const formatRut = (rut: string) => {
  let cleanedRut = cleanRut(rut);

  if (cleanedRut.length < 7) return cleanedRut;

  let body = cleanedRut.slice(0, -1);
  let dv = cleanedRut.slice(-1);

  body = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${body}-${dv}`;
};