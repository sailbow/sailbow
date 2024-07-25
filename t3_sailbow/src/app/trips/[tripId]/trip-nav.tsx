"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useRequiredTripLinks } from "@/lib/use-boat-links";

export function TripNav() {
  const path = usePathname();
  const links = useRequiredTripLinks();
  return (
    <nav className="hidden gap-4 sm:flex sm:flex-col">
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.href}
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
