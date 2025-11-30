"use client";
import { Calendar } from ".";
import { Drawer, DrawerContent, DrawerTrigger } from "../drawer";
import { cn } from "@/lib/utils";
import { CalendarDisclosureProps } from "./types";

const MobileCalendarDrawer = ({
  open,
  onOpenChange,
  trigger,
  ...calendarProps
}: CalendarDisclosureProps) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} modal>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="w-auto overflow-hidden p-0">
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
