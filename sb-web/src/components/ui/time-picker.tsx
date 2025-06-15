"use client";

import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import * as dfns from "date-fns";

export const TimePicker = ({
  value,
  onChange,
  disabled,
}: {
  value: number | null;
  onChange: (value: number) => void;
  disabled: boolean;
}) => {
  const current = new Date(value ?? -1);
  if (value === -1 || !value) {
    current.setHours(0, 0);
  }
  const isAm = current.getHours() < 12;
  let hour = current.getHours() % 12;
  hour = hour === 0 ? 12 : hour;
  return (
    <div className="flex w-full items-center gap-2">
      <Select
        disabled={disabled}
        value={`${current.getHours()}:${current.getMinutes()}`}
        onValueChange={(hourMinute) => {
          const [hourStr, minuteStr] = hourMinute.split(":");

          onChange(
            new Date(
              current.getFullYear(),
              current.getMonth(),
              current.getDate(),
              parseInt(hourStr),
              parseInt(minuteStr),
            ).getTime(),
          );
        }}
      >
        <SelectTrigger>
          <SelectValue>
            {`${hour}:${current.getMinutes().toString().padStart(2, "00")} ${isAm ? "AM" : "PM"}`}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="h-[40vh]" side="bottom">
          {Array.from({ length: 24 }, (_, i) => i).flatMap((hour) => {
            return Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => {
              const displayHour = hour % 12 === 0 ? 12 : hour % 12;
              const period = hour < 12 ? "AM" : "PM";
              const formattedMinute = minute.toString().padStart(2, "0");
              const formattedTimeString = `${displayHour}:${formattedMinute} ${period}`;
              const timeStringValue = `${hour}:${minute}`;
              return (
                <SelectItem key={timeStringValue} value={timeStringValue}>
                  {formattedTimeString}
                </SelectItem>
              );
            });
          })}
        </SelectContent>
      </Select>
    </div>
  );
};
