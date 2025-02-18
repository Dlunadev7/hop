export const getFormattedTime = (seconds: number) => {
  const now = new Date();
  now.setSeconds(now.getSeconds() + seconds);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";

  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};
