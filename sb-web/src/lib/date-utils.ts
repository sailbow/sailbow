import { format, isSameDay, isSameYear } from "date-fns";

const appendIfSameYear = (target: Date, formatStr: string) => {
  return isSameYear(target, new Date())
    ? format(target, formatStr)
    : format(target, `${formatStr}/yyyy`);
};
export function formatDateRange(start: Date, end?: Date): string {
  if (!end || isSameDay(start, end)) {
    return appendIfSameYear(start, "eee MM/d");
  }

  const startFormatted = format(start, "eee MM/d");
  return `${startFormatted} - ${appendIfSameYear(end, "eee MM/d")}`;
}
