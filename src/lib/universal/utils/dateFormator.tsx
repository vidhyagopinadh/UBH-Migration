import moment from "moment";
export const toDDmmyyyy = (date: string | undefined): string => {
  return moment(date).format("DD/MM/yyyy");
};
export const tommddyyyy = (date: string | undefined): string => {
  return moment(date).format("MM/DD/yyyy");
};

export const getNumberOfDays = (
  date1: Date,
  date2: Date,
): number => {
  // const date1 = new Date(start);
  // const date2 = new Date(end);

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Calculating the time difference between two dates
  const diffInTime = date2.getTime() - date1.getTime();

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay);

  return diffInDays;
};

export function genUniqueId(): string {
  const uniqueId = moment(new Date()).format("YYMMDDHmmssSSS");
  return uniqueId;
}
