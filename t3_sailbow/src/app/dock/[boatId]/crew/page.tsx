"use client";
import { useActiveBoat } from "@/hooks/use-boat";
import InviteCrewMember from "../invite";
import { CrewTable } from "./crew-table";
import CenteredSpinner from "@/app/_components/centered-spinner";

export default function Page() {
  const { isLoading } = useActiveBoat();
  if (isLoading) return <CenteredSpinner />;
  return (
    <div className="mt-0 flex size-full flex-col justify-items-end gap-2 overflow-y-auto px-2 pb-2">
      <div className="sticky top-0 z-10 flex w-full items-center gap-4 bg-background pt-2">
        <h1 className="text-xl leading-none tracking-tight sm:text-3xl">
          Crew
        </h1>
        <div className="ml-auto">
          <InviteCrewMember />
        </div>
      </div>
      <div className="flex-1">
        <CrewTable />
      </div>
    </div>
  );
}
