import { Disclosure } from "@/lib/use-disclosure";
import { CalendarProps } from ".";

export type CalendarDisclosureProps = CalendarProps &
  Disclosure & {
    trigger: React.ReactNode;
  };
