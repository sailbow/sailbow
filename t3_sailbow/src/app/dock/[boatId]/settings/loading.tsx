import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mt-2 size-full sm:mt-0">
      <Skeleton className="z-10 size-fit bg-slate-300">
        <h1 className="z-0 text-xl leading-none tracking-tight sm:text-3xl">
          Loading
        </h1>
      </Skeleton>
    </div>
  );
}
