"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import InviteForm from "./invite-form";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { type Doc } from "@convex/_generated/dataModel";
import { useDisclosure } from "@/lib/use-disclosure";

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

export default function InviteButton() {
  const disclosure = useDisclosure();
  return (
    <Dialog {...disclosure}>
      <DialogTrigger asChild>
        <Button>
          <Send className="mr-2 size-4" />
          Invite
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card">
        <InviteForm
          onSuccess={disclosure.setClosed}
          onCancel={disclosure.setClosed}
        />
      </DialogContent>
    </Dialog>
  );
}
