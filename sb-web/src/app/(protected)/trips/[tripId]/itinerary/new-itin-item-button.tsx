"use client";

import { Button } from "@/components/ui/button";
import { useDisclosure } from "@/lib/use-disclosure";
import { AddOrEditItinItem } from "./add-edit-itin-item";

export default function NewItinItemButton() {
  const disclosure = useDisclosure();
  return (
    <div className="inline-flex">
      <Button onClick={() => disclosure.setOpened()}>Add</Button>
      <AddOrEditItinItem disclosure={disclosure} />
    </div>
  );
}
