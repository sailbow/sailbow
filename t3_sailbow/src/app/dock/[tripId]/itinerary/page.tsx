import {
  BoatPageContainer,
  BoatPageHeader,
  BoatPageTitle,
  BoatPageContent,
} from "../../boat-page-components";

export default function Page() {
  return (
    <BoatPageContainer>
      <BoatPageHeader>
        <BoatPageTitle>Itinerary</BoatPageTitle>
      </BoatPageHeader>
      <BoatPageContent>
        <div className="w-full text-center">Nothing yet to see here!</div>
      </BoatPageContent>
    </BoatPageContainer>
  );
}
