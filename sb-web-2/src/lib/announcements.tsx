import { api } from "@convex/_generated/api";
import { useMut, UseMutationArgs, useQ } from "./convex-client-helpers";
import { useActiveTripId } from "./trip-queries";

export const useAnnouncements = () => {
  const tripId = useActiveTripId();
  return useQ({ query: api.announcements.queries.get, args: { tripId } });
};

export const useDeleteAnnouncement = (
  args: UseMutationArgs<typeof api.announcements.mutations.deleteAnnouncement>,
) => useMut(api.announcements.mutations.deleteAnnouncement, args);
