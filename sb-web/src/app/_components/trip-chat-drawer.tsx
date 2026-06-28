"use client";
import {
  TripChatMessageComposer,
  TripChatMessageContainer,
} from "@/components/trip-chat";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useState } from "react";

export default function TripChatDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction="bottom"
      modal={false}
    >
      <DrawerContent>
        <DrawerHeader className="justify-center">
          <DrawerTitle>Trip chat</DrawerTitle>
        </DrawerHeader>
        <div className="flex min-h-[30dvh] w-full overflow-y-auto">
          <TripChatMessageContainer />
        </div>

        <DrawerFooter className="items-center">
          <TripChatMessageComposer />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
