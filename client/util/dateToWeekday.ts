const WEEKDAY_NAMES_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const WEEKDAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export type WeekdayFormat = "long" | "short";

export function mapISODateToWeekday(isoDate: string, format: WeekdayFormat = "short"): string {
  const parsedDate = new Date(isoDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const weekdayIndex = parsedDate.getUTCDay();
  return format === "long" ? WEEKDAY_NAMES_LONG[weekdayIndex] : WEEKDAY_NAMES_SHORT[weekdayIndex];
}