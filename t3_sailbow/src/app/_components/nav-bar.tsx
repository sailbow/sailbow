"use client";

import { ClerkLoaded } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CreateBoatForm } from "./create-boat-form";
import { Bell, Plus } from "lucide-react";
import { UserNav } from "./user-nav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";

type NavbarProps = {
  children?: React.ReactNode | undefined;
};

export function Navbar(props: NavbarProps) {
  return (
    <header
      className="
  max-h-navbar-height min-h-navbar-height fixed top-0 z-40 flex w-full flex-row items-center
  justify-between overflow-hidden border-b-[1px] border-border/40 bg-background/90 p-2 sm:p-4"
    >
      <div className="flex items-center space-x-4 text-base lg:text-lg">
        {props?.children}
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full"
              aria-label="Toggle notifications menu"
            >
              <Bell className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <p className="font-medium">Notifications</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="min-h-[100px]">
              <p className="text-sm font-light">Nothing yet to see here!</p>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <UserNav />
      </div>
    </header>
  );
}
