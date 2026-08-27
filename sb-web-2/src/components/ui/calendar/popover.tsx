"use client";
import { cn } from "@/lib/utils";
import { Calendar } from ".";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { CalendarDisclosureProps } from "./types";
import { Separator } from "../separator";
import { Clock } from "lucide-react";
import { Input } from "../input";

const padZero = (val: number) => (val < 10 ? `0${val}` : val);

const CalendarPopover = ({
  open,
  onOpenChange,
  trigger,
  includeTime,
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
