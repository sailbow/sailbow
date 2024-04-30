"use client";

import { useActiveBoat } from "@/hooks/use-boat";

export default function Page() {
  const { activeBoat } = useActiveBoat();
  if (!activeBoat) return;
  return (
    <div className="mx-auto size-full overflow-y-auto">
      <h3 className="text-xl font-medium tracking-tight">{activeBoat?.name}</h3>
      <p className="leading-8">{activeBoat?.description}</p>
    </div>
  );
}
