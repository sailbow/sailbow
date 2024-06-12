import InviteCrewMember from "../invite";
import { CrewTable } from "./crew-table";

export default function Page() {
  return (
    <div className="mt-2 flex w-full flex-col gap-2 sm:mt-0">
      <div className="flex w-full items-center gap-4">
        <h1 className="text-xl leading-none tracking-tight sm:text-3xl">
          Crew
        </h1>
        <div className="ml-auto">
          <InviteCrewMember />
        </div>
      </div>
      <CrewTable />
    </div>
  );
}
