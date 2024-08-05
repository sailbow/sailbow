import { useQueries } from "convex/react";
import { makeUseQueryWithStatus } from "convex-helpers/react";
import { type Id } from "@convex/_generated/dataModel";
import { api } from "@convex/_generated/api";
import { useParams } from "next/navigation";

const useQuery = makeUseQueryWithStatus(useQueries);

const useActiveTripId = () => {
  const params = useParams<{ tripId: Id<"trips"> }>();
  return params.tripId;
};

export const useTrip = () => {
  const tripId = useActiveTripId();
  const q = useQuery(api.trips.queries.getByIdTest, { tripId });

  return {
    isPending: q.isPending,
    data: q.data?.data,
    applicationError: q.data?.error,
    error: q.error,
  };
};

export const useCrew = () => {
  const tripId = useActiveTripId();
  return useQuery(api.trips.queries.getTripCrew, { tripId });
};

export const useUserTrips = () => {
  return useQuery(api.trips.queries.getUserTrips);
};
