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
        <div className="flex flex-1 items-center bg-background p-2">
          <Input
            autoFocus
            type="search"
            placeholder="Search..."
            className="flex-1 rounded-lg bg-background"
            onChange={onSearchChange}
          />
        </div>
        {!!query && <DropdownMenuSeparator />}
        {isFetching ? (
          <CenteredSpinner />
        ) : boats?.length === 0 ? (
          <div className="w-full text-center text-sm text-muted-foreground">
            No boats were found
          </div>
        ) : (
          <DropdownMenuGroup>
            {boats?.map((b) => (
              <Link key={b.id} href={`/dock/${b.id}` as Route}>
                <DropdownMenuItem key={b.id} className="space-x-2">
                  {b.name}
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
