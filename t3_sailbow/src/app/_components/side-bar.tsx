"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { useGlobalActiveBoat } from "@/hooks/use-boat";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Home, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import ImageWithLoader from "./image-with-loader";
import { type Route } from "next";
import { useBoatLinks } from "@/lib/use-boat-links";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const links = useBoatLinks();
  const path = usePathname();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="link" className="size-6 rounded-full p-0">
          <Menu className="size-6 stroke-muted-foreground" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <div className="ml-2 size-10">
            <ImageWithLoader src="/icon.svg" alt="Sailbow Logo" />
          </div>
        </SheetHeader>
        {links && (
          <nav className="mt-4 flex flex-col gap-4">
            {links.map((link, index) => (
              <SheetClose key={index} asChild>
                <Link
                  href={link.href as Route}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    path === link.href && "bg-accent text-accent-foreground",
                    "justify-start",
                  )}
                >
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.title}
                </Link>
              </SheetClose>
            ))}
          </nav>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
