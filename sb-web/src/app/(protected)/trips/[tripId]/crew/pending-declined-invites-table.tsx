/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import { usePendingAndDeclinedInvites } from "@/lib/trip-queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ellipsis, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Doc } from "@convex/_generated/dataModel";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCancelInvite } from "@/lib/trip-mutations";
import { useDisclosure } from "@/lib/use-disclosure";
import { toast } from "@/components/ui/toast";
import { ConvexError } from "convex/values";
import { Spinner } from "@/app/_components/spinner";

const CancelInviteModal = ({ invite }: { invite: Doc<"invitations"> }) => {
  const disclosure = useDisclosure();
  const {
    mutate: cancel,
    isPending,
    isSuccess,
  } = useCancelInvite({
    onSuccess: () => {
      toast.success("Invitation cancelled");
      disclosure.setClosed();
    },
    onError: (error) => {
      if (error instanceof ConvexError && error.data.code === "USER_ERROR") {
        toast.error(error.data.message);
      } else {
        toast.error("Something went wrong there, please try again later");
      }
    },
  });
  return (
    <Dialog {...disclosure}>
      <DialogTrigger>
        <Button size="sm" variant="secondary">
          Cancel
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel this invitation?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">No, leave it</Button>
          </DialogClose>
          <Button
            onClick={() => cancel({ inviteId: invite._id })}
            disabled={isPending || isSuccess}
          >
            {isPending && (
              <Spinner className="mr-2 size-4 stroke-primary-foreground" />
            )}
            Yes, cancel it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export const PendingAndDeclinedInvitesTable = () => {
  const { data, isLoading } = usePendingAndDeclinedInvites();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Sent On</TableHead>
          <TableHead>
            <Button disabled variant="ghost" className="flex size-8 p-0">
              <Ellipsis className="h-4 w-4" />
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && !data ? (
          <TableRow>
            {Array.from({ length: 4 }).map((_, i) => (
              <TableCell key={i}>
                <Skeleton key={i} className="h-10 bg-slate-200"></Skeleton>
              </TableCell>
            ))}
          </TableRow>
        ) : (
          data!.map((invite) => (
            <TableRow
              key={invite._id}
              className="text-xs xs:text-sm md:text-base"
            >
              <TableCell>{invite.email}</TableCell>
              <TableCell>{invite.status}</TableCell>
              <TableCell>
                {new Date(invite._creationTime).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {invite.status === "pending" && (
                  <CancelInviteModal invite={invite} />
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
