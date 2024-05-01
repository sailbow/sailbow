"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
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

export default function Crumbs() {
  const path = usePathname();
  const { activeBoat } = useActiveBoat();
  const parts = path.split("/").filter((path) => path);
  return (
    <Breadcrumb>
      <BreadcrumbList className="w-full flex-nowrap gap-1 whitespace-nowrap text-sm text-foreground sm:gap-1">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dock">My Boats</Link>
            </Button>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {activeBoat && <BreadcrumbSeparator />}
        {activeBoat && (
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="justify-start ">
                  <span className="max-w-[150px] overflow-hidden text-ellipsis">
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
          </BreadcrumbItem>
        )}
        {activeBoat && parts.at(parts.length - 1) !== activeBoat.id.toString()}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
