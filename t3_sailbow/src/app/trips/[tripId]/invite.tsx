"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type CrewMember } from "@/lib/common-types";
import InviteForm from "./invite-form";
import { useIsXs } from "@/hooks/use-media-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Id } from "@convex/_generated/dataModel";

export const roleValueToDisplay = (
  value: CrewMember["role"],
): React.ReactNode => {
  switch (value) {
    case "firstMate":
      return "First Mate";
    case "crewMember":
      return "Crew Member";
    case "captain":
      return "Captain";
  }
};

export default function InviteCrewMember({ tripId }: { tripId: Id<"trips"> }) {
  const [isOpen, setIsOpen] = useState(false);
  const isXs = useIsXs();
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button>
          <UserPlus className="mr-2 size-4" />
          Invite
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side={isXs ? undefined : "left"}
        onInteractOutside={() => setIsOpen(false)}
        onEscapeKeyDown={() => setIsOpen(false)}
      >
        <InviteForm
          tripId={tripId}
          onSuccess={() => setIsOpen(false)}
          onCancel={() => setIsOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}
