import { api } from "@convex/_generated/api";
import { UseMutationArgs, useQ } from "./convex-client-helpers";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

export const useUnreadNotifications = () => {
  return useQ({ query: api.notifications.queries.myUnread, args: {} });
};

export const useDismissNotification = (
  args: UseMutationArgs<typeof api.notifications.mutations.dismiss>,
) => {
  return useMutation({
    mutationFn: useConvexMutation(
      api.notifications.mutations.dismiss,
    ).withOptimisticUpdate((localStore, args) => {
      const currentUnread = localStore.getQuery(
        api.notifications.queries.myUnread,
      );
      if (currentUnread) {
        localStore.setQuery(
          api.notifications.queries.myUnread,
          {},
          currentUnread.filter((n) => n._id !== args.notificationId),
        );
      }
    }),
    ...args,
    throwOnError: () => false,
  });
};
