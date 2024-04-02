import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps {
    className: string | undefined;
    isVisible?: boolean | undefined
}
export function Spinner(props: SpinnerProps) {
    if (props.isVisible === false) {
        return null;
    }
    return (
        <Loader2 className={cn(props.className, "animate-spin stroke-ring")} />
    )
}