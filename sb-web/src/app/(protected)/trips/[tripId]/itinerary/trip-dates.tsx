"use client";

import { Calendar } from "@/components/ui/calendar";
import { CalendarPopover } from "@/components/ui/calendar-popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useModules } from "@/lib/trip-queries";
import { Doc } from "@convex/_generated/dataModel";
import { dateRangeSchema } from "@convex/schema";
import { Infer, v } from "convex/values";
import { useEffect, useState, type PropsWithChildren } from "react";

const schema = v.object(dateRangeSchema);
type x = Infer<typeof schema>;
export const TripDates = (props: PropsWithChildren) => {
  const { isLoading, data: modules } = useModules();
  const [startDateInfo, setStartDateInfo] = useState<Date | undefined>(
    undefined,
  );
  const [endDateInfo, setEndDateInfo] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (modules) {
      // setStartDateInfo(modules.find((m) => m.type === "date"));
    }
  }, [modules]);

  if (isLoading) return <Skeleton className="h-8 flex-1" />;
  return (
    <Card className="max-w-full sm:max-w-2xl">
      <CardHeader>
        <CardTitle>Trip dates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* <CalendarPopover
            initialDate={startDateInfo}
            onSelect={setStartDateInfo}
          />
          <CalendarPopover
            initialDate={endDateInfo}
            onSelect={setEndDateInfo}
          /> */}
          <div className="flex flex-1 flex-col space-y-2">
            <Label>Start Date</Label>
            <DateTimePicker
              hourCycle={12}
              value={startDateInfo}
              onChange={setStartDateInfo}
              displayFormat={{ hour12: "PP hh:mm a" }}
              granularity="minute"
              placeholder="Start date"
            />
          </div>
          <div className="flex flex-1 flex-col space-y-2">
            <Label>End Date</Label>
            <DateTimePicker
              hourCycle={12}
              value={endDateInfo}
              onChange={setEndDateInfo}
              displayFormat={{ hour12: "PP hh:mm a" }}
              granularity="minute"
              placeholder="End date"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
