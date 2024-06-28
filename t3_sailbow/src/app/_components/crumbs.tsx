"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import Link from "next/link";
import { usePathname } from "next/navigation";
import BoatSearch from "./boat-search/boat-search";
import { useEffect, useState } from "react";

export default function Crumbs() {
  const path = usePathname();
  const { activeBoat } = useActiveBoat();
  const [showBoatSearch, setShowBoatSearch] = useState(false);
  const parts = path.split("/").filter((path) => path);

  useEffect(() => {
    setShowBoatSearch(!!activeBoat && !path.endsWith("/dock"));
  }, [activeBoat, path]);

  return (
    <Breadcrumb>
      <BreadcrumbList className="w-full flex-nowrap gap-1 whitespace-nowrap sm:gap-1">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dock">Boats</Link>
            </Button>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {showBoatSearch && <BreadcrumbSeparator />}
        {showBoatSearch && (
          <BreadcrumbItem>
            <BoatSearch />
          </BreadcrumbItem>
        )}
        {activeBoat && parts.at(parts.length - 1) !== activeBoat.id.toString()}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
