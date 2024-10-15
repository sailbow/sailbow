import {
  TripPageContainer,
  TripPageHeader,
  TripPageTitle,
  TripPageContent,
} from "../trip-page-components";
import { ItinItemList } from "./itin-item-list";
import NewItinItemButton from "./new-itin-item-button";

export default function Page() {
  return (
    <TripPageContainer>
      <TripPageHeader>
        <TripPageTitle>Itinerary</TripPageTitle>
        <div className="ml-auto">
          <NewItinItemButton />
        </div>
      </TripPageHeader>
      <TripPageContent>
        <div className="flex flex-col space-y-4">
          <ItinItemList />
        </div>
      </TripPageContent>
    </TripPageContainer>
  );
}
