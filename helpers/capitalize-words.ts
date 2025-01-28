const capitalizeWords = (input: string) => {
  if (!input || typeof input !== "string") return input;

  return input
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default capitalizeWords;