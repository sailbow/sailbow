import {
  BoatPageContainer,
  BoatPageHeader,
  BoatPageTitle,
  BoatPageContent,
} from "../../trip-page-components";
import DeleteTripCard from "./delete-trip-card";
import UpdateNameCard from "./update-name-card";

export default async function Page() {
  return (
    <BoatPageContainer>
      <BoatPageHeader>
        <BoatPageTitle>Settings</BoatPageTitle>
      </BoatPageHeader>
      <BoatPageContent>
        <div className="flex flex-col space-y-4">
          <UpdateNameCard />
          <DeleteTripCard />
        </div>
      </BoatPageContent>
    </BoatPageContainer>
  );
}
