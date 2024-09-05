"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export default function NotificationsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full"
          aria-label="Toggle notifications menu"
        >
          <Bell className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[90dvw] sm:w-[500px]" align="end">
        <DropdownMenuLabel className="font-normal">
          <p className="font-medium">Notifications</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="min-h-[100px] px-2 py-1.5">
          <p className="text-sm font-light">Nothing yet to see here!</p>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
