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
}
