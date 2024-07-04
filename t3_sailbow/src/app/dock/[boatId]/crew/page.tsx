"use client";
import { useActiveBoat } from "@/hooks/use-boat";
import InviteCrewMember from "../invite";
import { CrewTable } from "./crew-table";
import CenteredSpinner from "@/app/_components/centered-spinner";

export default function Page() {
  const { isLoading } = useActiveBoat();
  if (isLoading) return <CenteredSpinner />;
  return (
    <div className="m-auto h-full sm:container">
      <div className="flex size-full flex-col justify-between gap-2">
        <div className="flex w-full items-center gap-4 bg-background">
          <h1 className="text-xl leading-none tracking-tight sm:text-3xl">
            Crew
          </h1>
          <div className="ml-auto">
            <InviteCrewMember />
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <CrewTable />
        </div>

        {/* <div className="my-auto flex-1 overflow-hidden">
          <CrewTable />
        </div> */}

        {/* <div className="max-h-[90%]">
          
        </div> */}
      </div>
    </div>
  );
}
