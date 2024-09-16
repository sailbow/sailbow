import {
  TripPageContainer,
  TripPageContent,
  TripPageHeader,
  TripPageTitle,
} from "../trip-page-components";
import {
  AnnouncementList,
  CreateAnnouncementButton,
} from "./announcement-components";

export default function Page() {
  return (
    <TripPageContainer>
      <TripPageHeader>
        <TripPageTitle>Announcements</TripPageTitle>
        <div className="ml-auto">
          <CreateAnnouncementButton />
        </div>
      </TripPageHeader>
      <TripPageContent>
        <AnnouncementList />
      </TripPageContent>
    </TripPageContainer>
  );
}
