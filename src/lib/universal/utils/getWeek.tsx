import moment from "moment";
export function getWeek(): string {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - today.getDay());
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + (6 - today.getDay()));
  const startDateFormatted = moment(startDate).format("DD, MMMM YYYY");
  const endDateFormatted = moment(endDate).format("DD, MMMM YYYY");
  return startDateFormatted + " - " + endDateFormatted;
}
export function getWeekFromToday(): string {
  const today = new Date();
  const endDate = new Date(today);
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 6);
  const startDateFormatted = moment(startDate).format("DD, MMMM YYYY");
  const endDateFormatted = moment(endDate).format("DD, MMMM YYYY");
  return startDateFormatted + " - " + endDateFormatted;
}
