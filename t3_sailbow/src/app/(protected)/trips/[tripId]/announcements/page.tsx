import {
  BoatPageContainer,
  BoatPageContent,
  BoatPageHeader,
  BoatPageTitle,
} from "../../trip-page-components";
import {
  AnnouncementList,
  CreateAnnouncementButton,
} from "./announcement-components";

export default function Page() {
  return (
    <BoatPageContainer>
      <BoatPageHeader>
        <BoatPageTitle>Announcements</BoatPageTitle>
        <div className="ml-auto">
          <CreateAnnouncementButton />
        </div>
      </BoatPageHeader>
      <BoatPageContent>
        <AnnouncementList />
      </BoatPageContent>
    </BoatPageContainer>
  );
}
