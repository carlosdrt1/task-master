export function zeroTimeDate(date: Date): Date {
  const zeroDate = new Date(date);
  zeroDate.setHours(0, 0, 0, 0);
  return zeroDate;
}
