import {
  TripPageContainer,
  TripPageHeader,
  TripPageTitle,
  TripPageContent,
} from "../trip-page-components";
import { AddItinItem } from "./add-itin-item";
import { ItinItemList } from "./itin-item-list";

export default function Page() {
  return (
    <TripPageContainer>
      <TripPageHeader>
        <TripPageTitle>Itinerary</TripPageTitle>
        <div className="ml-auto">
          <AddItinItem />
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
