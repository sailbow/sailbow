"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { CreateBoatForm } from "../_components/create-boat-form";

export default function CreateBoatButton() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" className="hidden sm:inline-flex">
          <Plus className="mr-2 h-6 w-6" />
          <span>Create a boat</span>
        </Button>
      </SheetTrigger>
      <SheetTrigger asChild>
        <Button size="icon" className="inline-flex rounded-full sm:hidden">
          <Plus className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="min-h-full w-full overflow-y-auto sm:w-3/5 sm:max-w-none lg:w-2/5">
        <CreateBoatForm />
      </SheetContent>
    </Sheet>
  );
}
