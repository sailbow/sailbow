import { preloadQuery } from "convex/nextjs";
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
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

export default function Page({ params }: { params: { tripId: Id<"trips"> } }) {
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
