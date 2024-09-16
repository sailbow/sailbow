"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useTripLinks } from "@/lib/use-trip-links";

export function TripNav() {
  const path = usePathname();
  const links = useTripLinks();
  return (
    <nav className="hidden gap-4 pt-2 sm:flex sm:flex-col">
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.href}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            path === link.href && "bg-primary/30 text-accent-foreground",
            "justify-start hover:bg-primary/30",
          )}
        >
          <link.icon className="mr-2 h-4 w-4" />
          {link.title}
        </Link>
      ))}
    </nav>
  );
}
