"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import InviteForm from "./invite-form";
import { useIsXs } from "@/hooks/use-media-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { type Doc } from "@convex/_generated/dataModel";

export const roleValueToDisplay = (
  value: Doc<"crews">["role"],
): React.ReactNode => {
  // console.log(value);
  switch (value.trim()) {
    case "firstMate":
      return "First Mate";
    case "crewMember":
      return "Crew Member";
    case "captain":
      return "Captain";
  }
};

export default function InviteCrewMember() {
  const [isOpen, setIsOpen] = useState(false);
  const isXs = useIsXs();
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button>
          <Send className="mr-2 size-4" />
          Invite
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="bg-card"
        side={isXs ? undefined : "left"}
        onInteractOutside={() => setIsOpen(false)}
        onEscapeKeyDown={() => setIsOpen(false)}
      >
        <InviteForm
          onSuccess={() => setIsOpen(false)}
          onCancel={() => setIsOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}
