import { Id } from "@convex/_generated/dataModel";
import { useMut, UseMutationArgs, useQ } from "./convex-client-helpers";
import { api } from "@convex/_generated/api";

export const useInvite = (inviteId: Id<"invitations">) => {
  return useQ({ query: api.invitations.queries.byId, args: { inviteId } });
};

export const useAcceptInvite = (
  args: UseMutationArgs<typeof api.invitations.mutations.accept>,
) => {
  return useMut(api.invitations.mutations.accept, args);
};

export const useDeclineInvite = (
  args: UseMutationArgs<typeof api.invitations.mutations.decline>,
) => {
  return useMut(api.invitations.mutations.decline, args);
};
