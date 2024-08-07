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
import { Doc, Id } from "@convex/_generated/dataModel";
import { useActiveTripId } from "@/lib/trip-queries";

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
  const tripId = useActiveTripId();
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
          onSuccess={() => setIsOpen(false)}
          onCancel={() => setIsOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}
