"use client";

import type * as React from "react";
import { createContext, useContext } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface RDContextType {
  isMobile: boolean;
  desktopMode: "dialog" | "popover";
}

const RDContext = createContext<RDContextType | undefined>(undefined);

function useRD() {
  const context = useContext(RDContext);
  if (!context) {
    throw new Error("Responsive dialog components must be used within RD");
  }
  return context;
}

interface RDProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  desktopMode?: "dialog" | "popover";
  defaultOpen?: boolean;
}

export function RD({
  open,
  onOpenChange,
  children,
  desktopMode = "dialog",
  defaultOpen = false,
}: RDProps) {
  const isMobile = useIsMobile();

  const Comp = isMobile ? Drawer : desktopMode === "popover" ? Popover : Dialog;

  return (
    <RDContext.Provider value={{ isMobile, desktopMode }}>
      <Comp open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
        {children}
      </Comp>
    </RDContext.Provider>
  );
}

interface RDTriggerProps
  extends React.ComponentPropsWithoutRef<typeof DialogTrigger> {
  asChild?: boolean;
}

export function RDTrigger({ asChild = true, ...props }: RDTriggerProps) {
  const { isMobile, desktopMode } = useRD();
  const Comp = isMobile
    ? DrawerTrigger
    : desktopMode === "popover"
      ? PopoverTrigger
      : DialogTrigger;
  return <Comp asChild={asChild} {...props} />;
}

interface RDContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogContent> {}

export function RDContent({ ...props }: RDContentProps) {
  const { isMobile, desktopMode } = useRD();
  const Comp = isMobile
    ? DrawerContent
    : desktopMode === "popover"
      ? PopoverContent
      : DialogContent;

  if (isMobile) {
    return <Comp {...props} className="px-4 pb-4" />;
  }

  return <Comp {...props} />;
}

interface RDHeaderProps
  extends React.ComponentPropsWithoutRef<typeof DialogHeader> {}

export function RDHeader({ className, ...props }: RDHeaderProps) {
  const { isMobile, desktopMode } = useRD();
  if (!isMobile && desktopMode === "popover") {
    return (
      <div {...props} className={cn("grid gap-1.5 p-4 text-left", className)} />
    );
  }
  const Comp = isMobile ? DrawerHeader : DialogHeader;
  return <Comp {...props} />;
}

interface RDTitleProps
  extends React.ComponentPropsWithoutRef<typeof DialogTitle> {}

export function RDTitle({ className, ...props }: RDTitleProps) {
  const { isMobile, desktopMode } = useRD();
  if (!isMobile && desktopMode === "popover") {
    return (
      <div
        {...props}
        className={cn(
          "text-base font-semibold leading-none tracking-tight",
          className,
        )}
      />
    );
  }
  const Comp = isMobile ? DrawerTitle : DialogTitle;
  return <Comp {...props} />;
}

interface RDDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof DialogDescription> {}

export function RDDescription({ className, ...props }: RDDescriptionProps) {
  const { isMobile, desktopMode } = useRD();
  if (!isMobile && desktopMode === "popover") {
    return (
      <div
        {...props}
        className={cn("text-sm text-muted-foreground", className)}
      />
    );
  }
  const Comp = isMobile ? DrawerDescription : DialogDescription;
  return <Comp {...props} />;
}

interface RDFooterProps
  extends React.ComponentPropsWithoutRef<typeof DialogFooter> {}

export function RDFooter({ className, ...props }: RDFooterProps) {
  const { isMobile, desktopMode } = useRD();
  if (!isMobile && desktopMode === "popover") {
    return (
      <div
        {...props}
        className={cn("flex w-full items-center justify-end gap-2", className)}
      />
    );
  }
  const Comp = isMobile ? DrawerFooter : DialogFooter;
  return (
    <Comp
      {...props}
      className={cn("w-full flex-row items-center justify-center", className)}
    />
  );
}
