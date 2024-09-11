import {
  BoatPageContainer,
  BoatPageHeader,
  BoatPageTitle,
  BoatPageContent,
} from "../../trip-page-components";
import { TripDates } from "./trip-dates";

export default function Page() {
  return (
    <BoatPageContainer>
      <BoatPageHeader>
        <BoatPageTitle>Itinerary</BoatPageTitle>
      </BoatPageHeader>
      <BoatPageContent>
        <TripDates />
      </BoatPageContent>
    </BoatPageContainer>
  );
}
