import { format, isSameDay, isSameYear } from "date-fns";

export function formatDateRange(start: Date, end?: Date): string {
  if (!end) {
    return format(start, "eeee, MMM d, yyyy -");
  }
  // If both dates are on the same day
  if (isSameDay(start, end)) {
    return format(start, "eeee, MMM d, yyyy");
  }

  // If both dates are in the same year
  if (isSameYear(start, end)) {
    const startFormatted = format(start, "eeee, MMM d");
    const endFormatted = format(end, "eeee, MMM d");
    const year = format(start, "yyyy");
    return `${startFormatted} - ${endFormatted}, ${year}`;
  }

  // If dates are in different years
  const startFormatted = format(start, "eeee, MMM d, yyyy");
  const endFormatted = format(end, "eeee, MMM d, yyyy");
  return `${startFormatted} - ${endFormatted}`;
}
