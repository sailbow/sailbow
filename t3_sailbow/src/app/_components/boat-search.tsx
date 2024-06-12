"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useActiveBoat } from "@/hooks/use-boat";
import { ChevronsUpDown } from "lucide-react";
import { usePathname } from "next/navigation";

export default function BoatSearch() {
  const { activeBoat } = useActiveBoat();
  const path = usePathname();
  if (!activeBoat || path.endsWith("/dock")) return;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="justify-start">
          <span className="max-w-[150px] overflow-hidden text-ellipsis text-muted-foreground">
            {activeBoat?.name}
          </span>
          <ChevronsUpDown className="ml-2 size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Search</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <p>Nothing to see here yet!</p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
