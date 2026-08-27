import { useParams } from "@/lib/router-compat";
import { type Id } from "@convex/_generated/dataModel";
import { api } from "@convex/_generated/api";
import { useQ, useQueryWithStatus } from "./convex-client-helpers";
import { usePaginatedQuery } from "convex-helpers/react";
import { useConvexAuth } from "convex/react";

export const useActiveTripId = () => {
  const params = useParams<{ tripId: Id<"trips"> }>();
  return params.tripId;
};

export const useCrew = () => {
  const tripId = useActiveTripId();
  return useQueryWithStatus(
    api.trips.queries.getTripCrew,
    tripId ? { tripId } : "skip",
  );
};

export const useTrip = (tripId: Id<"trips">) => {
  return useQueryWithStatus(
    api.trips.queries.getById,
    Boolean(tripId) ? { tripId } : "skip",
  );
};

export const useActiveTrip = () => {
  const tripId = useActiveTripId();
  return useTrip(tripId);
};

export const useUserTrips = () => {
  return useQueryWithStatus(api.trips.queries.getUserTrips);
};

export const useSearchTrips = (searchText: string) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return useQ({
    query: api.trips.queries.searchTrips,
    args: { text: searchText },
    enabled: isAuthenticated && !isLoading,
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

export const useTripConversation = () => {
  const tripId = useActiveTripId();
  return usePaginatedQuery(
    api.trips.queries.getTripConversation,
    { tripId },
    { initialNumItems: 50 },
  );
};
