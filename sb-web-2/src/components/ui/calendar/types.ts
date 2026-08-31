import { Disclosure } from "@/lib/use-disclosure";
import { CalendarProps } from ".";

export type CalendarDisclosureProps = Exclude<CalendarProps, { mode: "" }> &
  Disclosure & {
    trigger: React.ReactNode;
    required?: true | undefined;
    includeTime?: true | undefined;
  };
