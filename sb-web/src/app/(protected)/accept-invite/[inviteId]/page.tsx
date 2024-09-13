"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CenteredSpinner from "@/app/_components/centered-spinner";
import { Button } from "@/components/ui/button";
import NotFoundPage from "@/app/_components/not-found-page";
import { toast } from "@/components/ui/toast";
import { type Id } from "@convex/_generated/dataModel";
import Redirect from "@/app/_components/redirect";
import { useEffect } from "react";

export default function AcceptInvitePage() {
  const { inviteId } = useParams<{ inviteId: Id<"invitations"> }>();
  const router = useRouter();
  const { data: me } = useQuery(convexQuery(api.users.queries.me, {}));

  const {
    isLoading,
    data: invite,
    error,
  } = useQuery(convexQuery(api.invitations.queries.byId, { inviteId }));

  const {
    isPending: isAcceptingInvite,
    mutate: acceptInvite,
    isSuccess: acceptedInvite,
  } = useMutation({
    mutationFn: useConvexMutation(api.invitations.mutations.accept),
    onSuccess: () => {
      router.push(`/trips/${invite?.tripId}`);
      toast.success("Invitation accepted!");
    },
  });

  const { isPending: isDecliningInvite, mutate: declineInvite } = useMutation({
    mutationFn: useConvexMutation(api.invitations.mutations.decline),
    onSuccess: () => {
      router.push("/trips");
      toast.warning(`Invitation to join ${invite?.tripName} declined`);
    },
  });

  useEffect(() => {
    if (invite?.status === "accepted") {
      toast.info("You already accepted this invite!");
      router.push(`/trips/${invite.tripId}`);
    }
  }, [invite, router]);

  if (isLoading || !me || invite?.status === "accepted")
    return <CenteredSpinner />;

  if (!invite) return <NotFoundPage />;

  return (
    <div className="w-full pt-4">
      <Dialog defaultOpen={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Invitation to join{" "}
              <span className="font-semibold">{invite.tripName}</span>
            </DialogTitle>
            <DialogDescription>
              {invite.invitedBy.firstName} {invite.invitedBy.lastName} has
              invited you to join {invite.tripName}. Would you like to accept?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="secondary"
                onClick={() => declineInvite({ inviteId })}
                disabled={
                  isAcceptingInvite || isDecliningInvite || acceptedInvite
                }
              >
                Decline
              </Button>
            </DialogClose>
            <Button
              disabled={
                isAcceptingInvite || isDecliningInvite || acceptedInvite
              }
              onClick={() => acceptInvite({ inviteId })}
            >
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
