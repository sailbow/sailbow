import {
  BoatPageContainer,
  BoatPageHeader,
  BoatPageTitle,
  BoatPageContent,
} from "../../boat-page-components";
import DeleteBoat from "./delete-boat";

export default function Page() {
  return (
    <BoatPageContainer>
      <BoatPageHeader>
        <BoatPageTitle>Settings</BoatPageTitle>
      </BoatPageHeader>
      <BoatPageContent>
        <DeleteBoat />
      </BoatPageContent>
    </BoatPageContainer>
  );
}
