"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, Locale } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function genMonths(
  locale: Pick<Locale, "options" | "localize" | "formatLong">,
) {
  return Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(2021, i), "MMMM", { locale }),
  }));
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const today = new Date();
  const years = Array.from({ length: 50 * 2 + 1 }, (_, i) => ({
    value: today.getFullYear() - 50 + i,
    label: (today.getFullYear() - 50 + i).toString(),
  }));

  const MONTHS = React.useMemo(() => {
    let locale: Pick<Locale, "options" | "localize" | "formatLong"> = enUS;
    const { options, localize, formatLong } = props.locale ?? {};
    if (options && localize && formatLong) {
      locale = {
        options,
        localize,
        formatLong,
      };
    }
    return genMonths(locale);
  }, []);
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      hideNavigation
      classNames={{
        month: "space-y-4",
        months:
          "flex flex-col sm:flex-row space-y-4 sm:space-y-0 relative gap-4",
        month_caption: "flex justify-center pt-1 relative items-center",
        month_grid: "w-full border-collapse space-y-1",
        caption_label: "text-sm font-medium",
        nav: "flex items-center justify-between absolute inset-x-0",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-10",
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-10",
        ),
        weeks: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-none first:aria-selected:rounded-l-md last:aria-selected:rounded-r-md",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        ),
        range_start:
          "day-range-start !bg-accent rounded-l-md [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground",
        range_end:
          "day-range-end !bg-accent rounded-r-md [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        selected: cn(
          props.mode === "range"
            ? "bg-primary hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
            : "[&>button]:hover:text-primary-foreground text-primary-foreground [&>button]:!bg-primary [&>button]:!text-primary-foreground !rounded-md",
        ),
        today: "bg-accent text-accent-foreground !rounded-md",
        outside:
          "day-outside text-muted-foreground opacity-50 !aria-selected:bg-accent/50 !aria-selected:text-muted-foreground !aria-selected:opacity-30",
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ ...props }) =>
          props.orientation === "left" ? (
            <ChevronLeft {...props} className="h-4 w-4" />
          ) : (
            <ChevronRight {...props} className="h-4 w-4" />
          ),
        MonthCaption: ({ calendarMonth }) => {
          return (
            <div className="flex w-full justify-center gap-2">
              <Select
                defaultValue={calendarMonth.date.getMonth().toString()}
                onValueChange={(value) => {
                  const newDate = new Date(calendarMonth.date);
                  newDate.setMonth(Number.parseInt(value, 10));
                  props.onMonthChange?.(newDate);
                }}
              >
                <SelectTrigger className="gap-1 border-none px-2 py-1 focus:bg-accent focus:text-accent-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem
                      key={month.value}
                      value={month.value.toString()}
                    >
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                defaultValue={calendarMonth.date.getFullYear().toString()}
                onValueChange={(value) => {
                  const newDate = new Date(calendarMonth.date);
                  newDate.setFullYear(Number.parseInt(value, 10));
                  props.onMonthChange?.(newDate);
                }}
              >
                <SelectTrigger className="gap-1 border-none p-1 px-2 py-1 focus:bg-accent focus:text-accent-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year.value} value={year.value.toString()}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
