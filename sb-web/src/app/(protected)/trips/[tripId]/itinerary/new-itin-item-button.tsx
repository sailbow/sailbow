"use client";

import { Button } from "@/components/ui/button";
import { AddOrEditItinItemForm } from "./itin-v2";
import { useDisclosure } from "@/lib/use-disclosure";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function NewItinItemButton() {
  const disclosure = useDisclosure();
  return (
    <div className="inline-flex">
      <Dialog {...disclosure}>
        <DialogTrigger asChild>
          <Button>Add</Button>
        </DialogTrigger>
        <DialogContent>
          <AddOrEditItinItemForm onSaveSuccess={disclosure.setClosed} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
