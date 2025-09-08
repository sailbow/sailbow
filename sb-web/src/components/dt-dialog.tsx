"use client";

import * as React from "react";
import { CalendarIcon, ChevronDownIcon, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "./ui/calendar";
// import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Disclosure, useDisclosure } from "@/lib/use-disclosure";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { cn } from "@/lib/utils";
import { format, setHours, setMinutes, parse } from "date-fns";
import { useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import { Matcher } from "react-day-picker";

type DtDialogProps = {
  // open: boolean;
  // onOpenChange: (open: boolean) => void;
  defaultValue?: number;
  defaultHour?: number;
  defaultMinute?: number;
  error?: boolean;
  disabled?: boolean;
  disabledDates?: Matcher;
  onChange: (value: number | undefined) => void;
};

const padZero = (val: number) => (val < 10 ? `0${val}` : val);
export function DtDialog({
  // open,
  // onOpenChange,
  defaultValue,
  defaultHour = 9,
  defaultMinute = 0,
  disabled = false,
  error = false,
  disabledDates,
  onChange,
}: DtDialogProps) {
  const [date, setDate] = useState<number | undefined>(defaultValue);
  const [time, setTime] = useState(
    `${padZero(defaultHour)}:${padZero(defaultMinute)}`,
  );
  const disclosure = useDisclosure();

  useEffect(() => {
    setDate((d) => {
      if (!d) return undefined;
      const [hours, minutes] = time.split(":");
      return setMinutes(
        setHours(d, parseInt(hours)),
        parseInt(minutes),
      ).getTime();
    });
  }, [time]);

  useEffect(() => {
    onChange(date);
  }, [date, onChange]);

  return (
    <Dialog {...disclosure}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            !!error && "border border-destructive",
          )}
        >
          <CalendarIcon className="h-4 w-4" />
          {date && `${format(date, "PP @p")}`}
          {!date && <span>Pick a date</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-fit max-w-sm">
        <DialogTitle className="sr-only">Select a date and time</DialogTitle>
        <div className="flex size-full flex-col items-center gap-4">
          <Calendar
            className="h-[325px]"
            mode="single"
            disabled={disabledDates}
            selected={date ? new Date(date) : undefined}
            onSelect={(date) => {
              if (!date) {
                setDate(undefined);
                return;
              }
              const [hours, minutes] = time.split(":");
              setDate(
                setMinutes(
                  setHours(date, parseInt(hours)),
                  parseInt(minutes),
                ).getTime(),
              );
            }}
          />
          <Separator className="w-full" />
          <div className="flex items-center justify-center gap-2">
            <Clock />
            <Input
              type="time"
              id="time-picker"
              step="60"
              disabled={!date}
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
              }}
              className="appearance-none bg-background font-mono [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
