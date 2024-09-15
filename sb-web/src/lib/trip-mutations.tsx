import { api } from "@convex/_generated/api";
import { type UseMutationArgs, useMut } from "./convex-client-helpers";

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
) => useMut(api.trips.mutations.updateTripBanner, args);

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

export const useSetDateRange = (
  args: UseMutationArgs<typeof api.modules.mutations.setTripDateRange>,
) => useMut(api.modules.mutations.setTripDateRange, args);

export const useUpsertItinItem = (
  args: UseMutationArgs<typeof api.itinerary.mutations.upsert>,
) => useMut(api.itinerary.mutations.upsert, args);

export const useCancelInvite = (
  args: UseMutationArgs<typeof api.invitations.mutations.cancel>,
) => useMut(api.invitations.mutations.cancel, args);
