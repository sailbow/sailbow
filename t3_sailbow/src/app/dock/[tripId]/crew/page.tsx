import { type Id } from "@convex/_generated/dataModel";
import {
  BoatPageContainer,
  BoatPageContent,
  BoatPageHeader,
  BoatPageTitle,
} from "../../boat-page-components";
import InviteCrewMember from "../invite";
import { CrewTable } from "./crew-table";
import { api } from "@convex/_generated/api";
import { preloadProtectedQuery } from "@/lib/convex-server-helpers";

export default async function Page({
  params,
}: {
  params: {
    tripId: Id<"trips">;
  };
}) {
  const preloadedCrew = await preloadProtectedQuery(
    api.trips.queries.getTripCrew,
    params,
  );
  return (
    <BoatPageContainer>
      <BoatPageHeader>
        <BoatPageTitle>Crew</BoatPageTitle>
        <div className="ml-auto">
          <InviteCrewMember tripId={params.tripId} />
        </div>
      </BoatPageHeader>
      <BoatPageContent>
        <CrewTable preloadedCrew={preloadedCrew} />
      </BoatPageContent>
    </BoatPageContainer>
  );
}
