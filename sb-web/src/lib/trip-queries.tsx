import { useParams } from "next/navigation";
import { type Id } from "@convex/_generated/dataModel";
import { api } from "@convex/_generated/api";
import { QArgs, useQ } from "./convex-client-helpers";

export const useActiveTripId = () => {
  const params = useParams<{ tripId: Id<"trips"> }>();
  return params.tripId;
};

export const useCrew = () => {
  const tripId = useActiveTripId();
  return useQ({ query: api.trips.queries.getTripCrew, args: { tripId } });
};

export const useTrip = (tripId: Id<"trips">) => {
  return useQ({ query: api.trips.queries.getById, args: { tripId } });
};

export const useActiveTrip = () => {
  const tripId = useActiveTripId();
  return useTrip(tripId);
};

export const useUserTrips = () => {
  return useQ({ query: api.trips.queries.getUserTrips, args: {} });
};

export const useSearchTrips = (searchText: string) => {
  return useQ({
    query: api.trips.queries.searchTrips,
    args: { text: searchText },
    // enabled: searchText !== "",
  });
};

export const useItinItems = () => {
  const tripId = useActiveTripId();
  return useQ({ query: api.itinerary.queries.list, args: { tripId } });
};

export const usePendingAndDeclinedInvites = () => {
  const tripId = useActiveTripId();
  return useQ({
    query: api.invitations.queries.listPendingAndDeclined,
    args: { tripId },
  });
};
