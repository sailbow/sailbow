"use client";
import Link from "next/link";
import Image from "next/image";
import { ClerkLoaded, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CreateBoatForm } from "./create-boat-form";
import { ThemeToggle } from "./theme-toggle";
import { Bell, Plus } from "lucide-react";

type NavbarProps = {
  children?: React.ReactNode | undefined;
} | undefined;

export function Navbar(props?: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b-[1px] border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-row items-center justify-between p-4">
        <nav className="flex items-center gap-10 text-xl">
          <Link href="/" className="flex items-center gap-2 text-xl min-w-16">
            <Image src="/icon.svg" alt="Sailbow Logo" width={32} height={32} />
          </Link>
          {props?.children}
        </nav>
        <div className="flex flex-row-reverse items-center gap-2">
          <ClerkLoaded>
            <UserButton />
            <Button size="icon" variant="ghost">
              <Bell className="w-6 h-6" />
            </Button>
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button>
                  Create a boat
                  <Plus className="ml-2 w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="min-h-full overflow-y-auto w-full sm:w-3/5 sm:max-w-none lg:w-2/5">
                <CreateBoatForm />
              </SheetContent>
            </Sheet>
          </ClerkLoaded>
        </div>
      </div>
    </header>

  );
}
