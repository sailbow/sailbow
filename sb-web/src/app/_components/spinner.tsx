import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type SpinnerProps =
  | {
      className?: string | undefined;
      isVisible?: boolean | undefined;
    }
  | undefined;
export function Spinner(props: SpinnerProps) {
  return (
    <Loader2
      className={cn(
        "size-6 animate-spin stroke-ring dark:stroke-white",
        props?.isVisible === false && "invisible",
        props?.className,
      )}
    />
  );
}
