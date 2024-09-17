"use client";

import { useItinItems } from "@/lib/trip-queries";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";
import { useEffect } from "react";
import { Doc } from "@convex/_generated/dataModel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type ItineraryItem = Doc<"itineraryItems">;
export const ItinItemList = () => {
  const { data: groupedItems, isLoading } = useItinItems();

  if (isLoading) {
    return (
      <Accordion type="single" className="mt-4 min-h-screen w-full max-w-2xl">
        <Card>
          <CardHeader className="px-6 py-2">
            <AccordionItem value="loading" disabled className="border-b-0">
              <AccordionTrigger>
                <div className="flex w-full items-center">
                  <Calendar className="mr-2 size-4" />
                  <Skeleton className="mr-2 h-8 flex-1" />
                </div>
              </AccordionTrigger>
            </AccordionItem>
          </CardHeader>
        </Card>
      </Accordion>
    );
  }

  if (!groupedItems) return;
  return (
    <Accordion
      type="multiple"
      className="mt-4 min-h-screen w-full max-w-2xl space-y-4"
    >
      {groupedItems.map(({ date, items }) => {
        return (
          <Card key={date.toString()}>
            <CardHeader className="px-6 py-2">
              <AccordionItem
                key={date}
                value={date.toString()}
                className="border-b-0"
              >
                <AccordionTrigger>
                  <div className="flex items-center">
                    <Calendar className="mr-2 size-4" />
                    <h2 className="text-xl font-semibold">
                      {new Date(date).toLocaleDateString()}
                    </h2>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3">
                  {items.map((item, index) => {
                    return (
                      <div className="flex w-full items-start" key={item._id}>
                        <div className="mr-2 max-w-max pt-4 text-base">
                          {index + 1}.
                        </div>
                        <Card className="flex-1 shadow-lg">
                          <CardHeader className="p-4">
                            <Accordion type="multiple">
                              <AccordionItem
                                value={item._id}
                                className="border-b-0"
                              >
                                {item.details ? (
                                  <AccordionTrigger className="py-0">
                                    <div className="flex flex-1 items-center justify-between text-lg font-medium">
                                      <span>{item.title}</span>
                                      <span className="mr-1 text-xs font-light">
                                        Details
                                      </span>
                                    </div>
                                  </AccordionTrigger>
                                ) : (
                                  <div className="text-lg font-medium">
                                    {item.title}
                                  </div>
                                )}
                                {!!item.details && (
                                  <AccordionContent className="pb-2 pt-2">
                                    <p className="min-h-16 rounded-md bg-slate-100 p-4 font-normal italic leading-none dark:bg-background">
                                      {item.details}
                                    </p>
                                  </AccordionContent>
                                )}
                              </AccordionItem>
                            </Accordion>
                          </CardHeader>
                        </Card>
                      </div>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            </CardHeader>
          </Card>
        );
      })}
    </Accordion>
  );
};
