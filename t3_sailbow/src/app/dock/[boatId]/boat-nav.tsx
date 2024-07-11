"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { type Route } from "next";
import { useRequiredBoatLinks } from "@/lib/use-boat-links";

export function BoatNav() {
  const path = usePathname();
  const links = useRequiredBoatLinks();
  return (
    <nav className="hidden gap-4 sm:flex sm:flex-col">
      {links.map((link, index) => (
        <Link
          key={index}
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
      ))}
    </nav>
  );
}
