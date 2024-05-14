import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mt-2 size-full sm:mt-0">
      <Skeleton className=" h-4 w-[200px]" />
    </div>
  );
}
