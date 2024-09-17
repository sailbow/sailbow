import { api } from "@convex/_generated/api";
import { type UseMutationArgs, useMut } from "./convex-client-helpers";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

export const useCreateTrip = (
  args: UseMutationArgs<typeof api.trips.mutations.create>,
) => useMut(api.trips.mutations.create, args);

export const useInviteCrewMember = (
  args: UseMutationArgs<typeof api.invitations.mutations.create>,
) => useMut(api.invitations.mutations.create, args);

export const useUpdateDescription = (
  args: UseMutationArgs<typeof api.trips.mutations.updateDescription>,
) => useMut(api.trips.mutations.updateDescription, args);

export const useUpdateName = (
  args: UseMutationArgs<typeof api.trips.mutations.updateName>,
) => useMut(api.trips.mutations.updateName, args);

export const useUpdateBanner = (
  args: UseMutationArgs<typeof api.trips.mutations.updateTripBanner>,
) => {
  return useMutation({
    mutationFn: useConvexMutation(
      api.trips.mutations.updateTripBanner,
    ).withOptimisticUpdate((localStore, args) => {
      const trip = localStore.getQuery(api.trips.queries.getById, {
        tripId: args.tripId,
      });
      console.log("optimistic banner update", trip);
      if (trip) {
        localStore.setQuery(
          api.trips.queries.getById,
          { tripId: args.tripId },
          { ...trip, banner: args.banner },
        );
      }
    }),
    ...args,
  });
};

export const useDeleteTrip = (
  args: UseMutationArgs<typeof api.trips.mutations.deleteTrip>,
) => useMut(api.trips.mutations.deleteTrip, args);

export const useKickMember = (
  args: UseMutationArgs<typeof api.trips.mutations.kickMember>,
) => useMut(api.trips.mutations.kickMember, args);

export const useChangeMemberRole = (
  args: UseMutationArgs<typeof api.trips.mutations.changeMemberRole>,
) => useMut(api.trips.mutations.changeMemberRole, args);

export const useCreateAnnouncement = (
  args: UseMutationArgs<typeof api.announcements.mutations.create>,
) => useMut(api.announcements.mutations.create, args);

export const useUpsertItinItem = (
  args: UseMutationArgs<typeof api.itinerary.mutations.upsert>,
) => useMut(api.itinerary.mutations.upsert, args);

export const useCancelInvite = (
  args: UseMutationArgs<typeof api.invitations.mutations.cancel>,
) => useMut(api.invitations.mutations.cancel, args);
