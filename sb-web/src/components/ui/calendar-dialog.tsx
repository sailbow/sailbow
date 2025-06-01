"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import { useDisclosure } from "@/lib/use-disclosure";

export function CalendarDialog({
  triggerText,
  selectedDate,
  onSelect,
  disabled,
  isInvalid = false,
}: {
  triggerText: string;
  selectedDate?: Date | undefined;
  disabled?: (date: Date) => boolean;
  onSelect: (date: Date | undefined) => void;
  isInvalid: boolean;
}) {
  const disclosure = useDisclosure();
  return (
    <Dialog {...disclosure}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            isInvalid && "border-destructive",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            format(selectedDate, "PPP")
          ) : (
            <span>{triggerText}</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[60vh] w-fit">
        <Calendar
          disabled={disabled}
          captionLayout="dropdown"
          mode="single"
          selected={selectedDate}
          onSelect={(day) => {
            onSelect(day);
            disclosure.setClosed();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
