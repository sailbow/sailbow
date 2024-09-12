import {
  BoatPageContainer,
  BoatPageHeader,
  BoatPageTitle,
  BoatPageContent,
} from "../../trip-page-components";
import { AddItinItem } from "./add-itin-item";
import { ItinItemList } from "./itin-item-list";

export default function Page() {
  return (
    <BoatPageContainer>
      <BoatPageHeader>
        <BoatPageTitle>Itinerary</BoatPageTitle>
        <div className="ml-auto">
          <AddItinItem />
        </div>
      </BoatPageHeader>
      <BoatPageContent>
        <div className="mt-4 flex flex-col space-y-4">
          <ItinItemList />
        </div>
      </BoatPageContent>
    </BoatPageContainer>
  );
}
