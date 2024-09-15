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
import { useEffect, useState } from "react";
import { type FunctionReturnType } from "convex/server";
import { useInvite } from "@/lib/invitations";
import { useMe } from "@/lib/user-queries";
import { useAcceptInvite, useDeclineInvite } from "@/lib/invitations";

type Invite = FunctionReturnType<typeof api.invitations.queries.byId>;
export default function AcceptInvitePage() {
  const { inviteId } = useParams<{ inviteId: Id<"invitations"> }>();
  const router = useRouter();
  const { data: me } = useMe();

  const [invite, setInvite] = useState<Invite | undefined>();

  const { isLoading, data } = useInvite(inviteId);

  useEffect(() => {
    if (!invite) {
      setInvite(data);
    }
  }, [invite, data]);

  const {
    isPending: isAcceptingInvite,
    mutate: acceptInvite,
    isSuccess: acceptedInvite,
  } = useAcceptInvite({
    onSuccess: () => {
      router.push(`/trips/${invite!.tripId}`);
      toast.success("Invitation accepted!");
    },
  });

  const { isPending: isDecliningInvite, mutate: declineInvite } =
    useDeclineInvite({
      onSuccess: () => {
        router.push("/trips");
        toast.warning(`Invitation to join ${invite!.tripName} declined`);
      },
    });

  useEffect(() => {
    if (invite?.status === "accepted") {
      router.push(`/trips/${invite.tripId}`);
      toast.info("You already accepted this invite!");
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
              Invitation to join the trip{" "}
              <span className="font-semibold">{invite.tripName}</span>
            </DialogTitle>
            <DialogDescription>
              {invite.invitedBy.firstName} {invite.invitedBy.lastName} has
              invited you to join the trip {invite.tripName}. Would you like to
              accept?
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
