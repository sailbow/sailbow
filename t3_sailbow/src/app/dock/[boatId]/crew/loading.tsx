import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mt-2 size-full sm:mt-0">
      <Skeleton className="bg-slate-300">
        <h1 className="sr-only text-xl leading-none tracking-tight sm:text-3xl">
          Loading
        </h1>
      </Skeleton>
    </div>
  );
}
