"use client";

import { Doc, Id } from "@convex/_generated/dataModel";
import { api } from "@convex/_generated/api";
import { useMut, useQueryWithStatus } from "@/lib/convex-client-helpers";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Plane,
  Home,
  MoreHorizontal,
  ChartNoAxesColumn,
  Utensils,
  Newspaper,
  Edit,
  Trash,
  Plus,
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
import {
  compareAsc,
  format,
  differenceInCalendarYears,
  setHours,
  setMinutes,
} from "date-fns";
import { useActiveTripId } from "@/lib/trip-queries";
import { useMutation } from "convex/react";
import { set, z } from "zod";
import { useDisclosure } from "@/lib/use-disclosure";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { CalendarDialog } from "@/components/ui/calendar-dialog";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { TimePicker } from "@/components/ui/time-picker";
import { Spinner } from "@/app/_components/spinner";
import { CompactTextEditor, useTextEditor } from "@/components/text-editor";
import { EditorContent } from "@tiptap/react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AccordionContent } from "@radix-ui/react-accordion";
import { PollDialog } from "@/components/poll-dialog";

type ItinItemV2 = Doc<"itineraryItemsV2">;

type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type UpsertItinItemV2 = MakeOptional<Omit<ItinItemV2, "_creationTime">, "_id">;

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

const ItinItem = ({
  item,
  showRail,
}: {
  item: ItinItemV2;
  showRail: boolean;
}) => {
  const itemStart = new Date(item.startDate);
  const editDisclosure = useDisclosure();
  const actionMenuDisclosure = useDisclosure();
  const pollDisclosure = useDisclosure();
  const editor = useTextEditor({
    content: item.details,
    isEditable: false,
    onTextChange: (text) => {
      console.log(text);
    },
  });
  const {
    mutate: deleteItem,
    isPending: isDeletingItem,
    isSuccess: deletedItem,
    reset,
  } = useMut(api.itinerary.v2.deleteItem, {
    onSuccess: () => {
      actionMenuDisclosure.setClosed();
      toast.success("Deleted itinerary item");
    },
    onError: (err) => {
      toast.error(err.message);
    },
    onSettled: () => {
      reset();
    },
  });

  return (
    <div key={item._id} className="relative flex h-full items-stretch">
      <div className="relative mr-4 basis-1/6">
        <div className="flex min-w-16 items-center justify-between gap-2">
          <div className="text-nowrap text-sm font-light">
            {format(itemStart, "p")}
          </div>
          <div className="z-10 flex size-11 items-center justify-center rounded-full bg-muted text-foreground">
            {getIcon(item.type)}
          </div>
        </div>
        {showRail && (
          <div className="absolute right-5 top-5  h-full w-0.5 bg-accent" />
        )}
      </div>
      <Card className="mb-8 w-full max-w-2xl pb-6">
        <CardHeader className="space-y-0 pb-0">
          <div className="flex justify-between">
            <CardTitle>{item.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Dialog {...editDisclosure}>
                <DropdownMenu {...actionMenuDisclosure}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DialogTrigger asChild>
                      <DropdownMenuItem disabled={isDeletingItem}>
                        <Edit className="mr-2 size-4" /> Edit details
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuItem
                      onClick={() => pollDisclosure.setOpened()}
                    >
                      <ChartNoAxesColumn className="mr-2 size-4" /> Start a poll
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteItem({ _id: item._id })}
                    >
                      <Trash className="mr-2 size-4" /> Delete item
                      <Spinner
                        isVisible={isDeletingItem || deletedItem}
                        className="ml-2 size-4"
                      />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent>
                  <AddOrEditItinItemForm
                    item={item}
                    onSaveSuccess={editDisclosure.setClosed}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        {!!item.details && (
          <CardContent className="py-0">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="justify-start gap-2 pb-1 text-sm text-muted-foreground">
                  Details
                </AccordionTrigger>
                <AccordionContent>
                  <EditorContent editor={editor} className="border-none p-2" />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        )}
      </Card>
      <AddItinPollDialog {...pollDisclosure} itemId={item._id} />
    </div>
  );
};

const AddItinPollDialog = ({
  open,
  onOpenChange,
  itemId,
}: {
  itemId: Id<"itineraryItemsV2">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { mutateAsync, isPending } = useMut(api.polls.createItineraryItemPoll, {
    onSuccess: () => {
      onOpenChange(false);
      toast.success("Success!");
    },
    onError: () => {
      toast.error("Something went wrong there", { position: "top-center" });
    },
  });

  return (
    <>
      <PollDialog
        open={open}
        onOpenChange={onOpenChange}
        title="New itinerary poll"
        isLoading={isPending}
        onSave={(data) =>
          mutateAsync({
            itineraryItemId: itemId,
            title: data.title,
            settings: {
              allowMultiple: data.settings.allowMultipleVotes,
              incognitoResponses: data.settings.incognitoResponses,
            },
            options: data.options.map((o) => o.value),
          })
        }
      />
    </>
  );
};

export const Itinerary = ({ items }: { items: ItinItemV2[] }) => {
  const itemsByDate = items.reduce((acc, current) => {
    const start = new Date(current.startDate);
    start.setHours(0, 0, 0, 0);
    const currentItems = acc.get(start.getTime());
    if (currentItems) {
      acc.set(start.getTime(), [...currentItems, current]);
    } else {
      acc.set(start.getTime(), [current]);
    }
    return acc;
  }, new Map<number, ItinItemV2[]>());

  return (
    <div className="flex w-full flex-col">
      {itemsByDate
        .keys()
        .toArray()
        .sort((aStr, bStr) => compareAsc(aStr, bStr))
        .map((date, ind, dates) => {
          const items =
            itemsByDate
              .get(date)
              ?.sort((a, b) => compareAsc(a.startDate, b.startDate))
              .map((item, index) => {
                const numItemsInDate = itemsByDate.get(date)?.length ?? 0;
                const showRail = index < numItemsInDate - 1;
                return <ItinItem key={index} item={item} showRail={showRail} />;
              }) ?? [];
          if (items.length < 1) return;
          const showYear =
            ind > 0 && differenceInCalendarYears(dates[ind - 1], date) !== 0;

          return (
            <div key={ind}>
              <h1 className="mb-6 text-2xl font-light">
                {showYear
                  ? format(new Date(date), "cccc MMMM do, y")
                  : format(new Date(date), "cccc MMMM do")}
              </h1>
              {items}
            </div>
          );
        })}
    </div>
  );
};

export const AddOrEditItinItemForm = ({
  onSaveSuccess,
  item,
}: {
  onSaveSuccess: () => void;
  item?: ItinItemV2;
}) => {
  const activeTripId = useActiveTripId();
  const [showEnd, setShowEnd] = useState(!!item?.endDate);
  const upsertItem = useMutation(api.itinerary.v2.upsert);
  const form = useForm({
    resolver: zodResolver(
      z.object({
        _id: z.custom<Id<"trips">>().optional(),
        tripId: z.custom<Id<"trips">>(),
        title: z
          .string({ message: "Required" })
          .min(1, { message: "Required" }),
        details: z.string(),
        location: z.string(),
        type: z.string().nullable(),
        startDate: z.number().min(0, { message: "Required" }),
        endDate: z.number().nullable(),
      }),
    ),
    defaultValues: {
      ...(item?._id && {
        _id: item._id,
      }),
      tripId: activeTripId,
      title: item?.title ?? "",
      details: item?.details ?? "",
      location: item?.location ?? "",
      type: item?.location ?? null,
      startDate: item?.startDate ? item.startDate : -1,
      endDate: item?.endDate ?? null,
    },
  });

  useEffect(() => {
    form.reset({
      ...(item?._id && {
        _id: item._id,
      }),
      tripId: activeTripId,
      title: item?.title ?? "",
      details: item?.details ?? "",
      location: item?.location ?? "",
      type: item?.location ?? null,
      startDate: item?.startDate ? item.startDate : -1,
      endDate: item?.endDate ?? null,
    });
    setShowEnd(!!item?.endDate);
  }, [item, activeTripId]);

  const onSubmit = async (data: UpsertItinItemV2) => {
    await upsertItem(data);
    toast.success("Itinerary updated");
    onSaveSuccess();
  };

  const endDate = form.watch("endDate");

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle>{item ? "Edit" : "New"} itinerary item</DialogTitle>
        </DialogHeader>
        <div className="flex w-full flex-col gap-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field, formState }) => {
              const error = formState.errors.title;
              return (
                <FormItem className="mt-2 space-y-0">
                  <FormControl>
                    <Input
                      {...field}
                      className={cn(
                        "",
                        !field.value && "font-light",
                        error ? "border-destructive" : "",
                      )}
                      placeholder="Add a title"
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field, formState }) => {
              return (
                <FormItem>
                  <FormLabel>Start date</FormLabel>
                  <FormControl>
                    <div className={cn("flex items-center gap-2")}>
                      <CalendarDialog
                        triggerText="Start date"
                        isInvalid={!!formState.errors.startDate}
                        selectedDate={
                          field.value >= 0 ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => {
                          if (!date) field.onChange(-1);
                          else if (field.value === -1)
                            field.onChange(date.getTime());
                          else {
                            const current = new Date(field.value);
                            const newDate = new Date(
                              date.getFullYear(),
                              date.getMonth(),
                              date.getDate(),
                              current.getHours(),
                              current.getMinutes(),
                            ).getTime();
                            if (endDate && newDate > endDate) {
                              form.setValue("endDate", -1);
                            }
                          }
                        }}
                      />
                      <TimePicker
                        disabled={field.value === -1}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              );
            }}
          />
          {showEnd ? (
            <FormField
              control={form.control}
              name="endDate"
              render={({ field, formState }) => {
                return (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <div className={cn("flex items-center gap-2")}>
                        <CalendarDialog
                          triggerText="End date"
                          // disabled={(date) => {
                          //   if (startDate === -1) return true;
                          //   const start = new Date(startDate);
                          //   start.setHours(0, 0);
                          //   return (
                          //     new Date(
                          //       date.getFullYear(),
                          //       date.getMonth(),
                          //       date.getDate(),
                          //     ).getTime() < start.getTime()
                          //   );
                          // }}
                          isInvalid={!!formState.errors.endDate}
                          selectedDate={
                            field.value && field.value >= 0
                              ? new Date(field.value)
                              : undefined
                          }
                          onSelect={(date) => {
                            if (!date) field.onChange(null);
                            else if (!field.value)
                              field.onChange(date.getTime());
                            else if (field.value) {
                              const current = new Date(field.value);
                              field.onChange(
                                new Date(
                                  date.getFullYear(),
                                  date.getMonth(),
                                  date.getDate(),
                                  current.getHours(),
                                  current.getMinutes(),
                                ).getTime(),
                              );
                            } else {
                              field.onChange(null);
                            }
                          }}
                        />
                        <TimePicker
                          disabled={!field.value}
                          value={field.value ?? null}
                          onChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          ) : (
            <Button
              className="flex h-8 w-fit items-center justify-start text-xs"
              variant="ghost"
              onClick={() => setShowEnd(true)}
            >
              <Plus className="mr-2 size-4" />
              End date
            </Button>
          )}
          <FormField
            control={form.control}
            name="details"
            render={({ field }) => {
              return (
                <FormItem className="mt-2 space-y-0">
                  <FormControl>
                    <CompactTextEditor
                      placeholder="Details, links, phone numbers, etc."
                      isEditable={true}
                      content={field.value}
                      onTextChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />
        </div>

        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
