import {
  BoatPageContainer,
  BoatPageContent,
  BoatPageHeader,
  BoatPageTitle,
} from "../../boat-page-components";
import InviteCrewMember from "../invite";
import { CrewTable } from "./crew-table";

export default function Page() {
  return (
    <BoatPageContainer>
      <BoatPageHeader>
        <BoatPageTitle>Crew</BoatPageTitle>
        <div className="ml-auto">
          <InviteCrewMember />
        </div>
      </BoatPageHeader>
      <BoatPageContent>
        <CrewTable />
      </BoatPageContent>
    </BoatPageContainer>
  );
  // return (
  //   <div className="h-full sm:container">
  //     <div className="flex size-full flex-col justify-between gap-2">
  //       <div className="flex w-full items-center gap-4 bg-background">
  //         <h1 className="text-xl leading-none tracking-tight sm:text-3xl">
  //           Crew
  //         </h1>
  //         <div className="ml-auto">
  //           <InviteCrewMember />
  //         </div>
  //       </div>
  //       <div className="flex-1 overflow-auto">
  //         <CrewTable />
  //       </div>
  //     </div>
  //   </div>
  // );
}
