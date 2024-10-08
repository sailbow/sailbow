"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Anchor, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import ImageWithLoader from "./image-with-loader";
import { type Route } from "next";
import { useTripLinks } from "@/lib/use-trip-links";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useActiveTrip } from "@/lib/trip-queries";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const links = useTripLinks();
  const { data: trip } = useActiveTrip();
  const path = usePathname();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="link" className="size-6 rounded-full p-0">
          <Menu className="size-6 stroke-muted-foreground" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader className="w-full items-center space-y-0">
          <SheetTitle className="inline-flex w-full  font-bold">
            <div className="mr-4 size-8 flex-none">
              <ImageWithLoader src="/icon.svg" alt="Sailbow Logo" />
            </div>
            sailbow
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-4 flex flex-col gap-4">
          <Separator />
          <div className="flex flex-col gap-2">
            <SheetClose asChild>
              <Link
                href={"/trips"}
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  }),
                  "justify-start",
                )}
              >
                <Anchor className="mr-2 h-4 w-4" />
                My Trips
              </Link>
            </SheetClose>
          </div>
          <Separator />
          <div className="flex flex-col gap-2">
            {trip && (
              <span className="px-1 py-1 font-semibold">{trip.name}</span>
            )}
            {trip &&
              links?.map((link, index) => (
                <SheetClose key={index} asChild>
                  <Link
                    href={link.href as Route}
                    className={cn(
                      buttonVariants({
                        variant: "ghost",
                        size: "sm",
                      }),
                      path === link.href && "bg-accent text-accent-foreground",
                      "justify-start",
                    )}
                  >
                    <link.icon className="mr-2 h-4 w-4" />
                    {link.title}
                  </Link>
                </SheetClose>
              ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
