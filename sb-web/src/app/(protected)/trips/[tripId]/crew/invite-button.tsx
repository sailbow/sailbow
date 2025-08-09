"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import InviteForm from "./invite-form";
import { Button, ButtonProps } from "@/components/ui/button";
import { Send } from "lucide-react";
import { type Doc } from "@convex/_generated/dataModel";
import { useDisclosure } from "@/lib/use-disclosure";
import { useIsMobile } from "@/hooks/use-mobile";

export const roleValueToDisplay = (
  value: Doc<"crews">["role"],
): React.ReactNode => {
  switch (value.trim()) {
    case "firstMate":
      return "First Mate";
    case "crewMember":
      return "Crew Member";
    case "captain":
      return "Captain";
  }
};

export default function InviteButton({
  variant = "default",
  size = "default",
}: {
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
}) {
  const disclosure = useDisclosure();
  // const isMobile = useIsMobile();
  return (
    <Dialog {...disclosure}>
      <DialogTrigger asChild>
        <Button size={size} variant={variant}>
          <Send className="size-4" />
          Invite
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a user</DialogTitle>
        </DialogHeader>
        <InviteForm
          onSuccess={disclosure.setClosed}
          onCancel={disclosure.setClosed}
        />
      </DialogContent>
    </Dialog>
  );
}
