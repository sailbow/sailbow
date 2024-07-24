import { type Id } from "@convex/_generated/dataModel";
import {
  BoatPageContainer,
  BoatPageHeader,
  BoatPageTitle,
  BoatPageContent,
} from "../../boat-page-components";
import DeleteTripCard from "./delete-trip-card";
import UpdateNameCard from "./update-name-card";
import { preloadQuery } from "convex/nextjs";
import { api } from "@convex/_generated/api";

export default async function Page({ tripId }: { tripId: Id<"trips"> }) {
  return (
    <BoatPageContainer>
      <BoatPageHeader>
        <BoatPageTitle>Settings</BoatPageTitle>
      </BoatPageHeader>
      <BoatPageContent>
        <div className="flex flex-col space-y-4">
          <UpdateNameCard />
          <DeleteTripCard />
        </div>
      </BoatPageContent>
    </BoatPageContainer>
  );
}
