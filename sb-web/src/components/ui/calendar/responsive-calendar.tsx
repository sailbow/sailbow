import { Disclosure } from "@/lib/use-disclosure";
import { CalendarProps } from ".";
import { CalendarDisclosureProps } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileCalendarDrawer from "./mobile-calendar-drawer";
import CalendarPopover from "./popover";

export type ResponsiveCalendarProps = CalendarDisclosureProps & {
  trigger: React.ReactNode;
  title?: string;
  description?: string;
};

const ResponsiveCalendarDisclosure = (props: ResponsiveCalendarProps) => {
  const isMobile = useIsMobile();
  if (!isMobile) {
    return <CalendarPopover {...props} />;
  }
  return <MobileCalendarDrawer {...props} />;
};

export default ResponsiveCalendarDisclosure;
