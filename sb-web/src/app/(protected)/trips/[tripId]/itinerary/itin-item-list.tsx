"use client";

import { useItinItems } from "@/lib/trip-queries";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon } from "lucide-react";

export const ItinItemList = () => {
  const { data: items, isLoading } = useItinItems();

  if (isLoading)
    return (
      <Accordion
        disabled={true}
        type="single"
        defaultValue="1"
        className="w-full max-w-2xl"
      >
        {Array.from({ length: 3 }, (v, k) => (
          <AccordionItem value="1" key={k}>
            <AccordionTrigger className="w-full">
              <Skeleton className="mr-2 h-8 w-full bg-slate-300" />
            </AccordionTrigger>
          </AccordionItem>
        ))}
      </Accordion>
    );

  return (
    <Accordion type="multiple" className="w-full max-w-2xl">
      {items?.map((item, index) => (
        <AccordionItem key={index} value={item._id}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex flex-col items-start text-left">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              {item.date && (
                <p className="mt-1 flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="mr-1 h-4 w-4 shrink-0" />
                  {new Date(item.date).toLocaleDateString()}
                </p>
              )}
            </div>
          </AccordionTrigger>
          {item.details && (
            <AccordionContent>
              <p className="mt-2 text-muted-foreground">{item.details}</p>
            </AccordionContent>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  );
};
