"use client";
import Link from "next/link";
import Image from "next/image";
import { ClerkLoaded } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CreateBoatForm } from "./create-boat-form";
import { Bell, Plus } from "lucide-react";
import { UserNav } from "./user-nav";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

type NavbarProps = {
  children?: React.ReactNode | undefined;
} | undefined;

export function Navbar(props?: NavbarProps) {
  return (
    <header className="
      sticky top-0 z-50 min-h-16 w-full border-b-[1px] border-border/40 bg-background/90 supports-backdrop-blur:bg-background/60
      flex flex-row items-center justify-between p-2 sm:p-4 overflow-hidden">
      <nav className="flex items-center space-x-4 text-base sm:text-lg">
        <Link href="/" className="hidden sm:flex items-center">
          <Image src="/icon.svg" alt="Sailbow Logo" width={24} height={24} />
        </Link>
        {props?.children}
      </nav>
      <div className="flex flex-row-reverse items-center gap-2">
        <ClerkLoaded>
          <UserNav />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-full" aria-label="Toggle notifications menu">
                <Bell className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <p className="font-medium">Notifications</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="min-h-[100px]">
                <p className="font-light text-sm">
                  Nothing yet to see here!
                </p>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" className="hidden md:inline-flex">
                <span>Create a boat</span>
                <Plus className="w-6 h-6 ml-2" />
              </Button>
            </SheetTrigger>
            <SheetTrigger asChild>
              <Button size="icon" className="hidden xs:inline-flex md:hidden rounded-full">
                <Plus className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="min-h-full overflow-y-auto w-full sm:w-3/5 sm:max-w-none lg:w-2/5">
              <CreateBoatForm />
            </SheetContent>
          </Sheet>
        </ClerkLoaded>
      </div>
    </header>

  );
}
