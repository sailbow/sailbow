"use client";
import Link from "next/link";
import Image from "next/image";
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
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

type NavbarProps =
  | {
      children?: React.ReactNode | undefined;
    }
  | undefined;

export function Navbar(props?: NavbarProps) {
  return (
    <header
      className="
      sticky top-0 z-50 flex min-h-16 w-full flex-row items-center
      justify-between overflow-hidden border-b-[1px] border-border/40 bg-background/60 p-2 sm:p-4"
    >
      <nav className="flex items-center space-x-4 text-base sm:text-lg">
        <Link href="/" className="hidden items-center sm:flex">
          <Image src="/icon.svg" alt="Sailbow Logo" width={24} height={24} />
        </Link>
        {props?.children}
      </nav>
      <div className="flex flex-row-reverse items-center gap-2">
        <ClerkLoaded>
          <UserNav />
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
          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" className="hidden md:inline-flex">
                <span>Create a boat</span>
                <Plus className="ml-2 h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className="hidden rounded-full xs:inline-flex md:hidden"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="min-h-full w-full overflow-y-auto sm:w-3/5 sm:max-w-none lg:w-2/5">
              <CreateBoatForm />
            </SheetContent>
          </Sheet>
        </ClerkLoaded>
      </div>
    </header>
  );
}
