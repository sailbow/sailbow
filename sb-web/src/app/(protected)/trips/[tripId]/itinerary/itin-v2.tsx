"use client";

import { Doc } from "@convex/_generated/dataModel";
import { useState } from "react";
import {
  Plane,
  Home,
  MoreHorizontal,
  ExternalLink,
  ChartNoAxesColumn,
  Utensils,
  LucideIcon,
  Newspaper,
  Edit,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";

type ItinItemV2 = Doc<"itineraryItemsV2">;

const icons: Record<string, LucideIcon> = {
  flight: Plane,
  food: Utensils,
  accomodation: Home,
  custom: Newspaper,
};

const getIcon = (itemType: string | undefined | null) => {
  switch (itemType) {
    case "flight":
      return <Plane className="size-5" />;
    case "meal":
      return <Utensils className="size-5" />;
    case "accomodation":
      return <Home className="size-5" />;
    default:
      return <Newspaper className="size-5" />;
  }
};

export const Itinerary = ({ items }: { items: ItinItemV2[] }) => {
  const itemsByDate = items.reduce((acc, current) => {
    const start = new Date(current.dates.start);
    start.setHours(start.getHours(), 0, 0, 0);
    const startTime = start.getTime();
    const currentItems = acc.get(startTime);
    if (currentItems) {
      acc.set(startTime, [...currentItems, current]);
    } else {
      acc.set(startTime, [current]);
    }
    return acc;
  }, new Map<number, ItinItemV2[]>());

  return (
    <div className="flex w-full max-w-4xl flex-col">
      {itemsByDate
        .keys()
        .toArray()
        .sort((a, b) => a - b)
        .map((dateInMs) => {
          const items = itemsByDate
            .get(dateInMs)
            ?.sort((a, b) => a.dates.start - b.dates.start)
            .map((item, index) => {
              const itemStart = new Date(item.dates.start);
              const itemEnd = new Date(item.dates.end);
              return (
                <div key={item._id} className="relative flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="relative flex items-center justify-center">
                      <div
                        className={`z-10 mt-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-foreground`}
                      >
                        {getIcon(item.type)}
                      </div>
                      {index < (itemsByDate.get(dateInMs)?.length ?? 0) - 1 && (
                        <div className="absolute top-14 z-0 h-[200%] w-0.5 bg-accent" />
                      )}
                    </div>
                  </div>
                  <Card className="mb-8 flex-1">
                    <CardHeader className="space-y-0">
                      <div className="flex justify-between">
                        <CardTitle>{item.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 size-4" /> Edit details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ChartNoAxesColumn className="mr-2 size-4" />{" "}
                                Start a poll
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Trash className="mr-2 size-4" /> Delete item
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <CardDescription>
                        {format(itemStart, "p")} - {format(itemEnd, "p")}
                      </CardDescription>
                    </CardHeader>
                    {!!item.details && (
                      <CardContent>
                        <p className="text-sm leading-none">{item.details}</p>
                      </CardContent>
                    )}
                  </Card>
                </div>
              );
            });
          return (
            <>
              <h1 className="mb-6 text-2xl font-light">
                {format(dateInMs, "cccc, MMMM do")}
              </h1>
              {items}
            </>
          );
        })}
    </div>
  );
};
