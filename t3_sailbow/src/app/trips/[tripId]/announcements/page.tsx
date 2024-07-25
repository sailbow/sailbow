import {
  BoatPageContainer,
  BoatPageContent,
  BoatPageHeader,
  BoatPageTitle,
} from "../../trip-page-components";

export default function Page() {
  return (
    <BoatPageContainer>
      <BoatPageHeader>
        <BoatPageTitle>Announcements</BoatPageTitle>
      </BoatPageHeader>
      <BoatPageContent>
        <div className="w-full text-center">Nothing yet to see here!</div>
      </BoatPageContent>
    </BoatPageContainer>
  );
}
