"use client";
import { cn } from "@/lib/utils";
import { Calendar } from ".";
import { Dialog, DialogContent, DialogTrigger } from "../dialog";
import { CalendarDisclosureProps } from "./types";
import { Separator } from "../separator";
import { Clock } from "lucide-react";
import { Input } from "../input";

const CalendarDialog = ({
  open,
  onOpenChange,
  trigger,
  includeTime,
  ...calendarProps
}: CalendarDisclosureProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="mx-auto max-h-[75dvh] min-w-fit">
        <Calendar
          {...calendarProps}
          fixedWeeks={calendarProps.fixedWeeks ?? true}
          numberOfMonths={calendarProps.numberOfMonths ?? 2}
          className={cn("bg-card", calendarProps.className)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CalendarDialog;
