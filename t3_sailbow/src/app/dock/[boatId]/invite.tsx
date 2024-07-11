"use client";

import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { api } from "@/trpc/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, UsersRound } from "lucide-react";
import { Spinner } from "@/app/_components/spinner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Boat } from "@/lib/schemas/boat";
import { useGlobalActiveBoat } from "@/hooks/use-boat";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type CrewMember } from "@/lib/common-types";
import InviteForm from "./invite-form";
import { useIsXs, useMediaQuery } from "@/hooks/use-media-query";

const TriggerContent = {
  LoadingBoat: (
    <Skeleton>
      <Button variant="outline" disabled={true}>
        <UserPlus className="mr-2 size-4" />
        Invite
      </Button>
    </Skeleton>
  ),
  BoatLoaded: (
    <Button>
      <UserPlus className="mr-2 size-4" />
      Invite
    </Button>
  ),
};

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

export default function InviteCrewMember() {
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
