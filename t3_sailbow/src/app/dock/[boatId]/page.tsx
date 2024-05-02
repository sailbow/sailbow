"use client";

import { useActiveBoat } from "@/hooks/use-boat";

export default function Page() {
  const { activeBoat } = useActiveBoat();
  if (!activeBoat) return;
  return (
    <div className="mx-auto size-full overflow-y-auto md:container">
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        {activeBoat?.name}
      </h2>
      <p className="mt-2 max-w-xl leading-8">{activeBoat?.description}</p>
    </div>
  );
}
