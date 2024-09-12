import {
  BoatPageContainer,
  BoatPageContent,
  BoatPageHeader,
  BoatPageTitle,
} from "../../trip-page-components";
import InviteButton from "./invite-button";
import { CrewTable } from "./crew-table";

export default function CrewPage() {
  return (
    <BoatPageContainer>
      <BoatPageHeader>
        <BoatPageTitle>Crew</BoatPageTitle>
        <div className="ml-auto">
          <InviteButton />
        </div>
      </BoatPageHeader>
      <BoatPageContent>
        <CrewTable />
      </BoatPageContent>
    </BoatPageContainer>
  );
}
