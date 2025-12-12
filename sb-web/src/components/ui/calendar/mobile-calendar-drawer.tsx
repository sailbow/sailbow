"use client";
import { Calendar } from ".";
import { Drawer, DrawerContent, DrawerTrigger } from "../drawer";
import { cn } from "@/lib/utils";
import { CalendarDisclosureProps } from "./types";
import { Clock } from "lucide-react";
import { Input } from "../input";
import { formatDate } from "date-fns";

const padZero = (val: number) => (val < 10 ? `0${val}` : val);

const getTimeStr = (date?: Date | undefined) => {
  if (!date) return undefined;
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  return `${hours}:${minutes}`;
};

const MobileCalendarDrawer = ({
  open,
  onOpenChange,
  trigger,
  includeTime,
  ...calendarProps
}: CalendarDisclosureProps) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <Calendar
          {...calendarProps}
          numberOfMonths={calendarProps.numberOfMonths ?? 1}
          className={cn(
            "mx-auto [--cell-size:clamp(0px,calc(100vw/7.5),52px)]",
            calendarProps.className,
          )}
        />
      </DrawerContent>
    </Drawer>
  );
};

export default MobileCalendarDrawer;
