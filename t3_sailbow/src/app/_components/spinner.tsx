import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type SpinnerProps =
  | {
      className?: string | undefined;
      isVisible?: boolean | undefined;
    }
  | undefined;
export function Spinner(props: SpinnerProps) {
  if (props && props.isVisible === false) {
    return null;
  }
  return (
    <Loader2
      className={cn("size-8 animate-spin stroke-ring dark:stroke-white")}
    />
  );
}
