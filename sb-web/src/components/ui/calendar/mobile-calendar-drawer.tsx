import { Disclosure } from "@/lib/use-disclosure";
import { Calendar, CalendarProps } from ".";
import { Drawer, DrawerContent, DrawerTrigger } from "../drawer";

type MobileCalendarDrawerProps = CalendarProps &
  Disclosure & {
    date?: Date;
    title?: string;
    description?: string;
    trigger: React.ReactNode;
  };
const MobileCalendarDrawer = ({
  open,
  onOpenChange,
  trigger,
  ...calendarProps
}: MobileCalendarDrawerProps) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="w-auto overflow-hidden p-0">
        <Calendar
          {...calendarProps}
          className="mx-auto [--cell-size:clamp(0px,calc(100vw/7.5),52px)]"
        />
      </DrawerContent>
    </Drawer>
  );
};

export default MobileCalendarDrawer;
