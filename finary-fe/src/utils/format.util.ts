export const formatDateWithTimezone = (dateString: string) => {
  const date = new Date(dateString);

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
