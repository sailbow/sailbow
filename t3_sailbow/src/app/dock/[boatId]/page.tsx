"use client";

import CenteredSpinner from "@/app/_components/centered-spinner";
import NotFoundPage from "@/app/_components/not-found-page";
import { useActiveBoat } from "@/hooks/use-boat";

export default function Page() {
  const { activeBoat, isLoading } = useActiveBoat();
  if (isLoading) return <CenteredSpinner />;
  if (!activeBoat) return <NotFoundPage />;
  return (
    <div className="size-full pt-2 sm:mt-0">
      <h1 className="border-b pb-1 text-xl leading-none tracking-tight sm:text-3xl">
        {activeBoat.name}
      </h1>
      <p className="mt-2 max-w-xl leading-8">{activeBoat.description}</p>
    </div>
  );
}
