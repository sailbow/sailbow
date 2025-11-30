"use client";
import { cn } from "@/lib/utils";
import { Calendar } from ".";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { CalendarDisclosureProps } from "./types";

const CalendarPopover = ({
  open,
  onOpenChange,
  trigger,
  ...calendarProps
}: CalendarDisclosureProps) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange} modal>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          {...calendarProps}
          fixedWeeks={calendarProps.fixedWeeks ?? true}
          numberOfMonths={calendarProps.numberOfMonths ?? 2}
          className={cn("rounded-md p-6", calendarProps.className)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default CalendarPopover;
