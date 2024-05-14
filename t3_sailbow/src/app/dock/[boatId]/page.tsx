"use client";

import { useActiveBoat } from "@/hooks/use-boat";

export default function Page() {
  const { activeBoat } = useActiveBoat();
  if (!activeBoat) return;
  return (
    <div className="mt-2 size-full sm:mt-0">
      <h1 className="border-b pb-1 text-xl leading-none tracking-tight sm:text-3xl">
        {activeBoat?.name}
      </h1>
      <p className="mt-2 max-w-xl leading-8">{activeBoat?.description}</p>
    </div>
  );
}
