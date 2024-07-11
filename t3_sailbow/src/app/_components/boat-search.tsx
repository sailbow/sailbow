"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useGlobalActiveBoat } from "@/hooks/use-boat";
import useDebounce from "@/lib/use-debounce";
import { api } from "@/trpc/react";
import { ChevronsUpDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { type ChangeEvent, useState, useEffect } from "react";
import CenteredSpinner from "./centered-spinner";
import Link from "next/link";
import { type Route } from "next";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function BoatSearch() {
  const { boat } = useGlobalActiveBoat();
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const query = useDebounce(searchTerm, 500);
  const { data: boats, isFetching } = api.dock.searchBoats.useQuery(
    { query: query },
    {
      enabled: !!query,
      keepPreviousData: false,
    },
  );

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };

  if (!boat || path.endsWith("/dock")) return;
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="justify-start">
          <span className="max-w-[150px] overflow-hidden text-ellipsis text-muted-foreground">
            {boat.name}
          </span>
          <ChevronsUpDown className="ml-2 size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72">
        <div className="flex flex-col space-y-3 bg-popover p-2">
          <Input
            autoFocus
            type="search"
            placeholder="Search..."
            className="rounded-lg"
            onChange={onSearchChange}
          />
          <DropdownMenuSeparator />
        </div>
        {isFetching ? (
          <CenteredSpinner />
        ) : boats?.length === 0 ? (
          <div className="w-full text-center text-sm text-muted-foreground">
            No boats were found
          </div>
        ) : (
          <ScrollArea>
            <DropdownMenuGroup className="max-h-[50dvh] overflow-y-auto">
              {boats?.map((b) => (
                <Link key={b.id} href={`/dock/${b.id}` as Route}>
                  <DropdownMenuItem key={b.id} className="space-x-2">
                    {b.name}
                  </DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuGroup>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
