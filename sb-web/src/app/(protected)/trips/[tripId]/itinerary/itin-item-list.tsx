"use client";

import { useActiveTripId, useItinItems } from "@/lib/trip-queries";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Ellipsis, PlusCircle, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDeleteItinItem } from "@/lib/trip-mutations";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Id, type Doc } from "@convex/_generated/dataModel";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useDisclosure } from "@/lib/use-disclosure";
import { AddOrEditItinItem } from "./add-edit-itin-item";
import { OptionalItinItem, ItinItem } from "./schema";
import { WithoutSystemFields } from "convex/server";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CenteredSpinner from "@/app/_components/centered-spinner";

const Item = ({
  item,
  index,
}: {
  item: ItinItem & { _id: Id<"itineraryItems"> };
  index: number;
}) => {
  const { mutate: deleteItem } = useDeleteItinItem({
    onError: (error) => {
      console.error(error);
      toast.error("Something went wrong there, please try again later");
    },
  });
  const [deleteClicked, setDeleteClicked] = useState(false);
  const editDisclosure = useDisclosure();
  const [editItem] = useState(item);
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
                  <p className="max-h-[50dvh] overflow-auto whitespace-pre-line rounded-md bg-slate-100 p-4 font-normal italic leading-none dark:bg-background">
                    {item.details}
                  </p>
                </AccordionContent>
              )}
            </AccordionItem>
          </Accordion>
        </CardHeader>
      </Card>
      <div className="pt-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <Ellipsis className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem
              onClick={() => {
                editDisclosure.setOpened();
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setDeleteClicked(true);
                setTimeout(() => {
                  deleteItem({ itemId: item._id });
                }, 300);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <AddOrEditItinItem disclosure={editDisclosure} item={item} />
    </div>
  );
};
export const ItinItemList = () => {
  const { data: items, isLoading } = useItinItems();
  const tripId = useActiveTripId();
  const disclosure = useDisclosure();
  const [editingItem, setEditingItem] = useState<OptionalItinItem | undefined>(
    undefined,
  );
  if (isLoading) {
    return <CenteredSpinner />;
  }

  if (!items) return;

  return (
    <div className="flex w-full flex-col gap-4">
      {items.map((item, index) => (
        <Item key={index} item={item} index={index} />
      ))}
    </div>
  );
  // return (
  //   <Accordion type="multiple" className="mt-4 w-full max-w-2xl space-y-4">
  //     {groupedItems.map(({ date, items }) => {
  //       return (
  //         <Card key={date.toString()}>
  //           <CardHeader className="px-3 py-2 sm:px-6">
  //             <AccordionItem
  //               key={date}
  //               value={date.toString()}
  //               className="border-b-0"
  //             >
  //               <AccordionTrigger>
  //                 <div className="flex items-center">
  //                   <Calendar className="mr-2 size-4" />
  //                   <h2 className="text-xl font-semibold">
  //                     {new Date(date).toLocaleDateString()}
  //                   </h2>
  //                 </div>
  //               </AccordionTrigger>
  //               <AccordionContent className="space-y-3">
  //                 {items.map((item, index) => (
  //                   <Item
  //                     key={item._id}
  //                     item={{ ...item, date: new Date(item.date) }}
  //                     index={index}
  //                   />
  //                 ))}
  //                 <Button
  //                   variant="ghost"
  //                   className="size-4 rounded-full p-0 hover:bg-transparent"
  //                   onClick={() => {
  //                     setEditingItem({
  //                       date: new Date(date),
  //                       time: null,
  //                       tripId,
  //                       title: "",
  //                       location: null,
  //                       details: "",
  //                     });
  //                     disclosure.setOpened();
  //                   }}
  //                 >
  //                   <PlusCircle className="size-full" />
  //                 </Button>
  //               </AccordionContent>
  //             </AccordionItem>
  //           </CardHeader>
  //         </Card>
  //       );
  //     })}
  //     {editingItem && (
  //       <AddOrEditItinItem disclosure={disclosure} item={editingItem} />
  //     )}
  //   </Accordion>
  // );
};
