"use client";

import { Button } from "@/components/ui/button";
import { AddOrEditItinItemForm } from "./itin-v2";
import { useDisclosure } from "@/lib/use-disclosure";
import { RD, RDContent, RDTrigger } from "@/components/ui/responsive-dialog";

export default function NewItinItemButton() {
  const disclosure = useDisclosure();
  return (
    <div className="inline-flex">
      <RD {...disclosure}>
        <RDTrigger asChild>
          <Button>Add</Button>
        </RDTrigger>
        <RDContent>
          <AddOrEditItinItemForm onSaveSuccess={disclosure.setClosed} />
        </RDContent>
      </RD>
    </div>
  );
}
