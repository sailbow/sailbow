"use client";

import BoatCard from "../_components/boat-card";
import { api } from "@/trpc/react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Spinner } from "../_components/spinner";
import { useActiveBoat } from "@/hooks/use-boat";
import { useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateBoatForm } from "../_components/create-boat-form";

export default function Page() {
  const { isLoading, data: boats } = api.dock.getBoats.useQuery();
  const { setActiveBoat } = useActiveBoat();
  useEffect(() => {
    if (setActiveBoat) {
      setActiveBoat(null);
    }
  }, [setActiveBoat]);

  if (isLoading) {
    return (
      <div className="mt-8 flex w-full items-center justify-center">
        <Spinner className="stroke-ring" />
      </div>
    );
  }
  return (
    <div className="relative size-full overflow-y-auto">
      <div className="container sticky top-0 z-10 flex items-center justify-between bg-muted p-4">
        <Breadcrumb>
          <BreadcrumbList className="text-xl">
            <BreadcrumbItem>
              <BreadcrumbPage>My Boats</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="sm" className="hidden md:inline-flex">
              <span>Create a boat</span>
              <Plus className="ml-2 h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="hidden rounded-full xs:inline-flex md:hidden"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent className="min-h-full w-full overflow-y-auto sm:w-3/5 sm:max-w-none lg:w-2/5">
            <CreateBoatForm />
          </SheetContent>
        </Sheet>
      </div>
      <div className="mx-auto mt-4 grid w-full grid-cols-1 gap-6 overflow-hidden px-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {boats?.map((boat) => {
          return <BoatCard key={boat.id} boat={boat} />;
        })}
      </div>
    </div>
  );
}
