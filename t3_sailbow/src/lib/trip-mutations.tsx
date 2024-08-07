import { api } from "@convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { type FunctionReference } from "convex/server";

type UseMutationArgs<
  TMutation extends FunctionReference<"mutation", "public">,
> =
  | {
      onError?: (error: Error, variables: TMutation["_args"]) => void;
      onSuccess?: (
        data: TMutation["_returnType"],
        variables: TMutation["_args"],
      ) => void;
      onMutate?: (variables: TMutation["_args"]) => void;
      onSettled?: (
        data: TMutation["_returnType"] | undefined,
        error: Error | null,
        variables: TMutation["_args"],
      ) => void;
    }
  | undefined;

const useMut = <TMutation extends FunctionReference<"mutation", "public">>(
  mut: TMutation,
  args?: UseMutationArgs<TMutation>,
) => {
  return useMutation({
    mutationFn: useConvexMutation(mut),
    ...args,
    throwOnError: () => false,
  });
};
export const useCreateTrip = (
  args: UseMutationArgs<typeof api.trips.mutations.create>,
) => useMut(api.trips.mutations.create, args);

export const useInviteCrewMember = (
  args: UseMutationArgs<typeof api.trips.mutations.inviteCrewMember>,
) => useMut(api.trips.mutations.inviteCrewMember, args);

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
