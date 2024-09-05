import { useParams } from "next/navigation";
import { type Id } from "@convex/_generated/dataModel";
import { api } from "@convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { type FunctionReference } from "convex/server";

type QArgs<TQuery extends FunctionReference<"query", "public">> = {
  query: TQuery;
  args: TQuery["_args"];
  enabled?: boolean | undefined;
};

const useQ = <TQuery extends FunctionReference<"query", "public">>(
  args: QArgs<TQuery>,
) => {
  return useQuery({
    ...convexQuery(args.query, args.args),
    enabled: args.enabled ?? true,
  });
};

export const useActiveTripId = () => {
  const params = useParams<{ tripId: Id<"trips"> }>();
  return params.tripId;
};

export const useCrew = () => {
  const tripId = useActiveTripId();
  return useQ({ query: api.trips.queries.getTripCrew, args: { tripId } });
};

export const useTrip = () => {
  const tripId = useActiveTripId();
  return useQ({ query: api.trips.queries.getById, args: { tripId } });
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

export const useAnnouncements = () => {
  const tripId = useActiveTripId();
  return useQ({ query: api.announcements.queries.get, args: { tripId } });
};
