/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Doc } from "@convex/_generated/dataModel";
import { useChangeMemberRole, useKickMember } from "@/lib/trip-mutations";
import { toast } from "@/components/ui/toast";
import { ConvexError } from "convex/values";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { roleValueToDisplay } from "../invite";

const KickMemberModal = ({
  member,
  isOpen,
  setIsOpen,
}: {
  member: Doc<"crews">;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const { mutate: kick, isPending } = useKickMember({
    onMutate: () => {
      toast.info("Kicking member...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success(`Successfully kicked ${member.email}`);
      setIsOpen(false);
    },
    onError: (error) => {
      toast.dismiss();
      if (error instanceof ConvexError && error.data.code === "USER_ERROR") {
        toast.error(error.data.message);
      } else {
        toast.error("Something went wrong there, please try again later");
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to kick {member.email}?
          </DialogTitle>
          <DialogDescription>
            You can always re-invite them later on
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={() =>
              kick({ tripId: member.tripId, memberId: member._id })
            }
            disabled={isPending}
          >
            Kick
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ChangeMemberRoleModal = ({
  member,
  isOpen,
  setIsOpen,
}: {
  member: Doc<"crews">;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const { mutate: changeRole, isPending } = useChangeMemberRole({
    onMutate: () => {
      toast.info("Changing role...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success(`Successfully updated the role for ${member.email}`);
      setIsOpen(false);
    },
    onError: (error) => {
      toast.dismiss();
      if (error instanceof ConvexError && error.data.code === "USER_ERROR") {
        toast.error(error.data.message);
      } else {
        toast.error("Something went wrong there, please try again later");
      }
    },
  });

  useEffect(() => {
    if (!isOpen) {
      setRole(member.role);
    }
  }, [isOpen, member.role]);

  const [role, setRole] = useState(member.role);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change the role for {member.email}</DialogTitle>
        </DialogHeader>
        <Select
          onValueChange={(value) => setRole(value as typeof member.role)}
          defaultValue={member.role}
          value={role}
        >
          <SelectTrigger>
            <SelectValue>{roleValueToDisplay(role)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="crewMember">Crew Member</SelectItem>
            <SelectItem value="firstMate">First Mate</SelectItem>
          </SelectContent>
        </Select>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={() =>
              changeRole({
                tripId: member.tripId,
                memberId: member._id,
                role: role as "crewMember" | "firstMate",
              })
            }
            disabled={isPending}
          >
            Change role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function CrewMemberActions({ member }: { member: Doc<"crews"> }) {
  const [isKickModalOpen, setIsKickModalOpen] = useState(false);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <Ellipsis className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setIsChangeRoleModalOpen(true)}>
            Change Role
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsKickModalOpen(true)}>
            Kick
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <KickMemberModal
        member={member}
        isOpen={isKickModalOpen}
        setIsOpen={setIsKickModalOpen}
      />
      <ChangeMemberRoleModal
        member={member}
        isOpen={isChangeRoleModalOpen}
        setIsOpen={setIsChangeRoleModalOpen}
      />
    </>
  );
}
