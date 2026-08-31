import { Disclosure } from "@/lib/use-disclosure";
import { CalendarProps } from ".";
import { CalendarDisclosureProps } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileCalendarDrawer from "./mobile-calendar-drawer";
import CalendarPopover from "./popover";
import CalendarDialog from "./dialog";

export type ResponsiveCalendarProps = CalendarDisclosureProps & {
  trigger: React.ReactNode;
  desktopMode?: "popover" | "dialog";
  title?: string;
  description?: string;
};

const ResponsiveCalendarDisclosure = (props: ResponsiveCalendarProps) => {
  const isMobile = useIsMobile();
  const desktopMode = props.desktopMode ?? "popover";
  if (!isMobile) {
    if (desktopMode === "dialog") return <CalendarDialog {...props} />;
    return <CalendarPopover {...props} />;
  }
  return <MobileCalendarDrawer {...props} />;
};

export default ResponsiveCalendarDisclosure;
