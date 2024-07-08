"use client";

import Link from "next/link";
import {
  Home,
  ListChecks,
  Megaphone,
  Settings,
  UsersRound,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname } from "next/navigation";
import { type Route } from "next";
import { useBoatLinks } from "@/lib/use-boat-links";

export function BoatNav() {
  const isSm = useMediaQuery("(max-width: 640px)");
  const path = usePathname();
  const links = useBoatLinks();
  if (!links) return;
  return (
    <div className="sticky top-0 z-10 w-full flex-none bg-background sm:mx-0 sm:w-auto">
      <nav className="flex justify-between sm:flex-col sm:justify-normal sm:gap-4">
        {links.map((link, index) =>
          isSm ? null : (
            // <Tooltip key={index} delayDuration={0}>
            //   <TooltipTrigger asChild>
            //     <Link
            //       href={link.href as Route}
            //       className={cn(
            //         buttonVariants({ variant: "ghost", size: "icon" }),
            //         "h-9 w-9",
            //         path == link.href && "bg-accent text-accent-foreground",
            //       )}
            //     >
            //       <link.icon className="h-4 w-4" />
            //       <span className="sr-only">{link.title}</span>
            //     </Link>
            //   </TooltipTrigger>
            //   <TooltipContent className="flex items-center gap-4">
            //     {link.title}
            //   </TooltipContent>
            // </Tooltip>
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
          ),
        )}
      </nav>
    </div>
  );
}
