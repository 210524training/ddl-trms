export default function toLocaleString(
  date: string | undefined = undefined,
): string {
  if (date) return new Date(date).toLocaleString();
  return new Date().toLocaleString();
}

export function daysToYears(days: number) {
  return days / 365;
}

export function monthsToYears(months: number) {
  return months / 12;
}

export function yearsToWeeks(years: number) {
  return years * 52.1429;
}

export function diffInYears(start: Date, end: Date = new Date()) {
  const yearDiff = Math.abs(end.getFullYear() - start.getFullYear());
  const monthDiff = Math.abs(end.getMonth() - start.getMonth());
  const dayDiff = Math.abs(end.getDay() - start.getDay());
  const ellapsedYears = yearDiff + monthsToYears(monthDiff) + daysToYears(dayDiff);
  return ellapsedYears;
}

export function diffInWeeks(start: Date, end: Date = new Date()) {
  return yearsToWeeks(diffInYears(start, end));
}
