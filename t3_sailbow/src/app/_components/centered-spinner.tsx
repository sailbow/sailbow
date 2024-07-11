import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

export default function CenteredSpinner(props: {
  className?: string | null | undefined;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center p-4",
        props?.className,
      )}
    >
      <Spinner />
    </div>
  );
}
