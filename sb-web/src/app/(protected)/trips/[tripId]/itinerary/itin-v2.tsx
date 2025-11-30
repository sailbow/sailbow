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
  MapPin,
  CornerUpRight,
  Globe,
  CircleAlertIcon,
  BarChart,
  Info,
  Eye,
  BarChart2,
  NotepadText,
  Vote,
  Pencil,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
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
  formatDistanceToNow,
} from "date-fns";
import { useActiveTripId, useCrew } from "@/lib/trip-queries";
import { useMutation } from "convex/react";
import { set, z } from "zod";
import { useDisclosure } from "@/lib/use-disclosure";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { DefaultValues, useForm, useWatch } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
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
import {
  GooglePlaceResultSchema,
  GooglePlaceSearchPopover,
} from "@/components/google-places";
import Link from "next/link";
import { useMe } from "@/lib/user-queries";
import { AnswerPollDialog } from "@/components/answer-poll-dialog";
import { PollResultsChart } from "@/components/poll-results-chart";
import { DateTimePicker } from "@/components/ui/datetime-calendar";
import LoadingButton from "@/components/loading-button";
import { Separator } from "@/components/ui/separator";
import RainbowBarChart from "@/components/ui/rainbow-barchart";
import { useTheme } from "next-themes";
import { DtDialog } from "@/components/dt-dialog";

type ItinItemV2 = Doc<"itineraryItemsV2">;

type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type UpsertItinItemV2 = MakeOptional<
  Omit<ItinItemV2, "_creationTime">,
  "_id" | "location"
> & {
  location?: Exclude<ItinItemV2["location"], string | null>;
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

const ItinItem = ({
  item,
  showRail,
}: {
  item: ItinItemV2;
  showRail: boolean;
}) => {
  const { data: me } = useMe();
  const itemStart = new Date(item.startDate);
  const editDisclosure = useDisclosure();
  const actionMenuDisclosure = useDisclosure();
  const pollDisclosure = useDisclosure();
  const answerPollDisclosure = useDisclosure();
  const pollResultsDisclosure = useDisclosure();
  const deleteItemDialogDisclosure = useDisclosure();
  const { data: poll } = useQueryWithStatus(api.polls.getItinItemPoll, {
    itineraryItemId: item._id,
  });
  const { data: crew } = useCrew();
  const editor = useTextEditor({
    content: item.details,
    isEditable: false,
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

  const { mutateAsync: respondToPoll, isPending: isRespondingToPoll } = useMut(
    api.polls.respondToItinItemPoll,
    {
      onSuccess: () => {
        answerPollDisclosure.setClosed();
        toast.success("Success!", { position: "top-center" });
      },
      onError: () => {
        toast.error("Something went wrong there");
      },
    },
  );

  const theme = useTheme();

  const hasRespondedToPoll =
    me && poll?.responses.some((v) => v.userId === me._id);

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
      <Card className="mb-8 w-full max-w-4xl">
        <CardHeader className="p-0 px-6 pb-4 pt-6">
          <div className="flex gap-2">
            <CardTitle>{item.title}</CardTitle>
            <div className="ml-auto flex gap-2">
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
                    {!poll && (
                      <DropdownMenuItem
                        onClick={() => pollDisclosure.setOpened()}
                      >
                        <ChartNoAxesColumn className="mr-2 size-4" /> Start a
                        poll
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => deleteItemDialogDisclosure.setOpened()}
                    >
                      <Trash className="mr-2 size-4" /> Delete item
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
          {item?.location && (
            <>
              <CardDescription>{item.location.primaryText}</CardDescription>
              <div className="flex flex-wrap gap-2">
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${item.location.primaryText}&destination_place_id=${item.location.placeId}`}
                  className={buttonVariants({
                    size: "sm",
                    variant: "outline",
                    className: "underline-offset-2 hover:underline",
                  })}
                >
                  <CornerUpRight className="h-4 w-4" />
                  Get Directions
                </Link>
                {item.location.website && (
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={item.location.website}
                    className={buttonVariants({
                      size: "sm",
                      variant: "outline",
                      className: "underline-offset-2 hover:underline",
                    })}
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </Link>
                )}
              </div>
            </>
          )}
        </CardHeader>
        {(Boolean(item.details) || Boolean(poll)) && (
          <CardContent className="space-y-4">
            {poll && (
              <Accordion type="single" collapsible defaultValue={"item-1"}>
                <AccordionItem value="item-1" className="w-full border-b-0">
                  <AccordionTrigger className="max-w-full items-start gap-2 p-0">
                    <div className="flex w-full flex-col gap-2 xs:flex-row xs:items-center">
                      <div
                        className={cn(
                          "inline-flex items-center font-bold",
                          theme.theme === "dark" &&
                            "bg-gradient-to-r from-[#A8EAE1] via-[#FCDDAE] via-55% to-[#F7A9CA] bg-clip-text text-transparent",
                        )}
                      >
                        <RainbowBarChart className="mr-2 size-8" />
                        <span className="bg-clip-text">{poll.title}</span>
                        &nbsp;
                      </div>
                      {!poll.closedOn &&
                        poll.due &&
                        poll.due > new Date().getTime() && (
                          <div className="ml-auto mr-1">
                            <div className="text-amber-00 inline-flex items-center gap-1 text-xs dark:text-amber-700">
                              <Info className="size-3" />
                              Poll ends in{" "}
                              {formatDistanceToNow(poll.due, {
                                includeSeconds: false,
                              })}
                            </div>
                          </div>
                        )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="ml-8 border-t pt-2">
                    <div className="flex w-full max-w-sm flex-col items-start gap-2 ">
                      {hasRespondedToPoll && (
                        <div className="flex w-full items-center gap-2">
                          <div className="text-nowrap text-muted-foreground">
                            You responded:{" "}
                            <span className="text-card-foreground">
                              {poll.responses
                                .find((r) => r.userId === me?._id)
                                ?.choices.reduce((acc, current) => {
                                  const curValue = poll.options.find(
                                    (o) => o._id === current,
                                  )?.value;
                                  if (Boolean(acc)) {
                                    acc += ", " + curValue;
                                  } else {
                                    acc = curValue ?? "";
                                  }
                                  return acc;
                                }, "")}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size={"sm"}
                            onClick={() => answerPollDisclosure.setOpened()}
                            className="ml-auto text-xs font-light"
                          >
                            <Pencil className="size-4 text-secondary-foreground" />
                            Edit Response
                          </Button>
                        </div>
                      )}
                      {!hasRespondedToPoll && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => answerPollDisclosure.setOpened()}
                        >
                          <Vote className="size-4 text-secondary-foreground" />
                          Cast Vote
                        </Button>
                      )}
                      {poll && poll.responses.length > 0 && (
                        <div className="mt-2 w-full">
                          <PollResultsChart
                            poll={poll}
                            users={crew?.map((cm) => ({
                              ...cm,
                              _id: cm.userId as Id<"users">,
                            }))}
                          />
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
            {item.details && (
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-b-0">
                  <AccordionTrigger className="gap-2 p-0">
                    <div className="inline-flex w-full items-center justify-start text-sm text-card-foreground">
                      <NotepadText className="mr-2 text-muted-foreground" />
                      Details
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="ml-8 flex flex-col items-start gap-2 rounded-b-sm border-t bg-background">
                    <EditorContent
                      editor={editor}
                      className="border-none p-2"
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </CardContent>
        )}
      </Card>
      <AddItinPollDialog {...pollDisclosure} itemId={item._id} />
      {me && poll && (
        <AnswerPollDialog
          {...answerPollDisclosure}
          isLoading={isRespondingToPoll}
          poll={poll}
          userId={me._id}
          handleSubmit={(choices) => {
            return respondToPoll({
              itineraryItemPollId: poll.itineraryItemPollId,
              choices,
            });
          }}
        />
      )}
      {poll && poll.responses.length > 0 && (
        <Dialog {...pollResultsDisclosure}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{poll.title}</DialogTitle>
              <DialogDescription>Poll results</DialogDescription>
            </DialogHeader>
            <PollResultsChart
              poll={poll}
              users={crew?.map((cm) => ({
                ...cm,
                _id: cm.userId as Id<"users">,
              }))}
            />
          </DialogContent>
        </Dialog>
      )}
      <Dialog {...deleteItemDialogDisclosure}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this itinerary item?
            </DialogTitle>
            <DialogDescription>This action cannot be undone!</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <LoadingButton
              variant="destructive"
              isLoading={isDeletingItem || deletedItem}
              onClick={() => deleteItem({ _id: item._id })}
            >
              Yes, delete
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
            due: data.due,
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

const addOrEditSchema = z
  .object({
    _id: z.string().min(1).optional(),
    tripId: z.string().min(1),
    title: z.string({ message: "Required" }).min(1, { message: "Required" }),
    details: z.string(),
    location: GooglePlaceResultSchema.optional(),
    type: z.string().nullable(),
    startDate: z.number().min(0, { message: "Required" }),
    endDate: z.number().nullable(),
  })
  .superRefine(({ startDate, endDate }, ctx) => {
    if (endDate && endDate < startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Cannot be before start date",
      });
    }
  });
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
  const defaultValues = {
    ...(item?._id && {
      _id: item._id,
    }),
    tripId: activeTripId,
    location: item?.location,
    title: item?.title ?? "",
    details: item?.details ?? "",
    type: item?.type ?? null,
    startDate: item?.startDate,
    endDate: item?.endDate ?? null,
  };
  const form = useForm({
    resolver: zodResolver(addOrEditSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset({
      ...(item?._id && {
        _id: item._id,
      }),
      tripId: activeTripId,
      title: item?.title ?? "",
      location: item?.location,
      details: item?.details ?? "",
      type: item?.type ?? null,
      startDate: item?.startDate,
      endDate: item?.endDate ?? null,
    });
    setShowEnd(!!item?.endDate);
  }, [item, activeTripId]);

  const start = form.watch("startDate");

  const onSubmit = async (data: UpsertItinItemV2) => {
    await upsertItem(data);
    toast.success("Itinerary updated");
    onSaveSuccess();
  };

  const startDateNumber = form.watch("startDate");
  let startDate: Date | undefined;
  if (startDateNumber) {
    startDate = new Date(startDateNumber);
  }

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit((values) =>
          onSubmit({ ...values, startDate: values.startDate! }),
        )}
      >
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
                <FormItem>
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
          <div className="grid gap-2 xs:grid-cols-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field, formState }) => {
                return (
                  <FormItem className="max-xs:grid max-xs:grid-cols-[auto_1fr] max-xs:items-center max-xs:gap-4">
                    <FormLabel>Start date</FormLabel>
                    <FormControl>
                      <DtDialog
                        defaultValue={field.value}
                        onChange={field.onChange}
                        error={!!formState.errors.startDate}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field, formState }) => {
                return (
                  <FormItem className="max-xs:grid max-xs:grid-cols-[auto_1fr] max-xs:items-center max-xs:gap-4">
                    <FormLabel className="max-xs:grid max-xs:gap-2">
                      End Date{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <DtDialog
                        defaultValue={field.value ?? undefined}
                        onChange={field.onChange}
                        error={!!formState.errors.endDate}
                        disabled={!start}
                        disabledDates={
                          start ? { before: new Date(start) } : undefined
                        }
                        defaultMonth={start ? new Date(start) : undefined}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </div>
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => {
              const { value, ...props } = field;
              const trigger = (
                <Button
                  {...props}
                  variant="outline"
                  className="w-full justify-start pl-3"
                >
                  <MapPin className="size-4 opacity-50" />
                  <span
                    className={cn(
                      "w-full text-wrap text-left",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value ? field.value.primaryText : "Search"}
                  </span>
                </Button>
              );
              return (
                <FormItem>
                  <FormLabel>
                    Location{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <GooglePlaceSearchPopover
                      trigger={trigger}
                      onSelect={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />
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
          <LoadingButton isLoading={form.formState.isSubmitting} type="submit">
            Save
          </LoadingButton>
        </DialogFooter>
      </form>
    </Form>
  );
};
