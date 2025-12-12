"use client";

import { useParams, useRouter } from "next/navigation";
import { api } from "@convex/_generated/api";
import {
  RD,
  RDContent,
  RDDescription,
  RDFooter,
  RDHeader,
  RDTitle,
} from "@/components/ui/responsive-dialog";
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
import LoadingButton from "@/components/loading-button";
import { useDisclosure } from "@/lib/use-disclosure";

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
      disclosure.setClosed();
    },
  });

  const { isPending: isDecliningInvite, mutate: declineInvite } =
    useDeclineInvite({
      onSuccess: () => {
        router.push("/trips");
        toast.warning(`Invitation to join ${invite!.tripName} declined`);
        disclosure.setClosed();
      },
    });

  useEffect(() => {
    if (invite?.status === "accepted") {
      router.push(`/trips/${invite.tripId}`);
      toast.info("You already accepted this invite!");
    }
  }, [invite, router]);

  const disclosure = useDisclosure();

  if (isLoading || !me || invite?.status === "accepted")
    return <CenteredSpinner />;

  if (!invite) return <NotFoundPage />;

  return (
    <div className="w-full pt-4">
      <RD defaultOpen={true} {...disclosure}>
        <RDContent>
          <RDHeader>
            <RDTitle>
              Invitation to join the trip{" "}
              <span className="font-semibold">{invite.tripName}</span>
            </RDTitle>
            <RDDescription>
              {invite.invitedBy.firstName} {invite.invitedBy.lastName} has
              invited you to join the trip {invite.tripName}. Would you like to
              accept?
            </RDDescription>
          </RDHeader>
          <RDFooter>
            <LoadingButton
              isLoading={isDecliningInvite}
              variant="outline"
              onClick={() => declineInvite({ inviteId })}
              disabled={
                isAcceptingInvite || isDecliningInvite || acceptedInvite
              }
            >
              Decline
            </LoadingButton>
            <LoadingButton
              isLoading={isAcceptingInvite || acceptedInvite}
              disabled={
                isAcceptingInvite || isDecliningInvite || acceptedInvite
              }
              onClick={() => acceptInvite({ inviteId })}
            >
              Accept
            </LoadingButton>
          </RDFooter>
        </RDContent>
      </RD>
    </div>
  );
}
