"use client";

import { useItinItems } from "@/lib/trip-queries";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, X } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { useDeleteItinItem } from "@/lib/trip-mutations";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Doc } from "@convex/_generated/dataModel";
import { useState } from "react";
import { cn } from "@/lib/utils";
// className={cn(
//   "relative min-h-16 w-full gap-4 p-2 text-sm outline-none transition-all duration-300 ease-in-out",
//   deleteClicked && "-translate-x-full transform opacity-0",
// )}
const ItinItem = ({
  item,
  index,
}: {
  item: Doc<"itineraryItems">;
  index: number;
}) => {
  const { mutate: deleteItem } = useDeleteItinItem({
    onError: (error) => {
      console.error(error);
      toast.error("Something went wrong there, please try again later");
    },
  });
  const [deleteClicked, setDeleteClicked] = useState(false);
  return (
    <div
      className={cn(
        "flex w-full items-start gap-2 transition-all duration-300 ease-in-out",
        deleteClicked && "-translate-x-full transform opacity-0",
      )}
    >
      <div className="pt-2 text-base">{index + 1}.</div>
      <Card className="flex-1 shadow-lg">
        <CardHeader className="px-2 py-2 sm:px-4">
          <Accordion type="multiple">
            <AccordionItem value={item._id} className="border-b-0">
              {item.details ? (
                <AccordionTrigger className="py-0">
                  <div className="flex flex-1 items-center justify-between text-base font-medium">
                    <span className="mr-2 text-left">{item.title}</span>
                    <span className="mr-1 text-xs font-light">Details</span>
                  </div>
                </AccordionTrigger>
              ) : (
                <div className="text-base font-medium">{item.title}</div>
              )}
              {!!item.details && (
                <AccordionContent className="py-2">
                  <p className="rounded-md bg-slate-100 p-4 font-normal italic leading-none dark:bg-background">
                    {item.details}
                  </p>
                </AccordionContent>
              )}
            </AccordionItem>
          </Accordion>
        </CardHeader>
      </Card>
      <div className="pt-1">
        <Button
          variant="ghost"
          onClick={() => {
            setDeleteClicked(true);
            setTimeout(() => {
              deleteItem({ itemId: item._id });
            }, 300);
          }}
          className="size-8 p-0 hover:bg-destructive/30"
        >
          <X className="size-4 shrink-0" />
        </Button>
      </div>
    </div>
  );
};
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
            <CardHeader className="px-3 py-2 sm:px-6">
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
                  {items.map((item, index) => (
                    <ItinItem key={item._id} item={item} index={index} />
                  ))}
                </AccordionContent>
              </AccordionItem>
            </CardHeader>
          </Card>
        );
      })}
    </Accordion>
  );
};
