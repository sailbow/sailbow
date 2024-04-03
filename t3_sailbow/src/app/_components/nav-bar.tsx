"use client";
import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CreateBoatForm } from "./create-boat-form";
import { Bell, Plus } from "lucide-react";

export function Navbar() {
  return (
    <div className="flex h-full flex-row items-center justify-between p-4">
      <nav className="flex items-center gap-10 text-xl">
        <Link href="/" className="flex items-center gap-2 text-xl">
          <Image src="/icon.svg" alt="Sailbow Logo" width={32} height={32} />
        </Link>
      </nav>
      <div className="flex flex-row-reverse items-center gap-4">
        <UserButton />
        <Button variant="ghost">
          <Bell className="w-6 h-6" />
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="lg">
              Create a boat
              <Plus className="ml-2 w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:w-3/5 sm:max-w-none lg:w-2/5">
            <CreateBoatForm />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
