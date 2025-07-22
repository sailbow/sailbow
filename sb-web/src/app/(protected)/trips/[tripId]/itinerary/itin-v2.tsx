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
} from "date-fns";
import { useActiveTripId, useCrew } from "@/lib/trip-queries";
import { useMutation } from "convex/react";
import { set, z } from "zod";
import { useDisclosure } from "@/lib/use-disclosure";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
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
      <Card className="mb-8 w-full max-w-2xl">
        <CardHeader>
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
                    variant: "secondary",
                    className: "underline-offset-2 hover:underline",
                  })}
                >
                  <CornerUpRight className="mr-1 h-4 w-4" />
                  Get Directions
                </Link>
                {item.location.website && (
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={item.location.website}
                    className={buttonVariants({
                      size: "sm",
                      variant: "secondary",
                      className: "underline-offset-2 hover:underline",
                    })}
                  >
                    <Globe className="mr-1 h-4 w-4" />
                    Website
                  </Link>
                )}
              </div>
            </>
          )}
        </CardHeader>
        {(Boolean(item.details) || Boolean(poll)) && (
          <CardContent>
            {poll && (
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="w-full border-b-0">
                  <AccordionTrigger className="max-w-full gap-2 pb-1 text-muted-foreground">
                    <div className="inline-flex items-center fill-card-foreground text-muted-foreground [&>span]:text-card-foreground">
                      <BarChart2 className="mr-1" />
                      <span>{poll.title}</span>&nbsp;
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col items-start gap-2 px-4 py-2">
                    {crew && (
                      <div className="text-sm text-muted-foreground">{`(${poll.responses.length}/${crew.length}) responded`}</div>
                    )}
                    {hasRespondedToPoll && (
                      <div className="text-sm text-muted-foreground">
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
                    )}
                    <div className="flex gap-2">
                      {hasRespondedToPoll ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => answerPollDisclosure.setOpened()}
                        >
                          <Edit className="mr-2 size-4" />
                          Edit response
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => answerPollDisclosure.setOpened()}
                        >
                          <Plus className="mr-2 size-4 text-secondary-foreground" />
                          Respond
                        </Button>
                      )}
                      {poll.responses.length > 0 && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => pollResultsDisclosure.setOpened()}
                        >
                          <Eye className="mr-2 size-4" />
                          View results
                        </Button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
            {item.details && (
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-b-0">
                  <AccordionTrigger className="justify-start gap-2 pb-1 text-sm text-muted-foreground">
                    Details
                  </AccordionTrigger>
                  <AccordionContent>
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
              <DialogTitle>Poll results</DialogTitle>
              <DialogDescription>{poll.title}</DialogDescription>
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
        location: GooglePlaceResultSchema.optional(),
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
      location: item?.location,
      title: item?.title ?? "",
      details: item?.details ?? "",
      type: item?.type ?? null,
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
      location: item?.location,
      details: item?.details ?? "",
      type: item?.type ?? null,
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
                    <DateTimePicker
                      hourCycle={12}
                      value={field.value ? new Date(field.value) : undefined}
                      {...(field.value && {
                        defaultPopupValue: new Date(field.value),
                      })}
                      onChange={(date) => field.onChange(date?.getTime())}
                      granularity="minute"
                      displayFormat={{
                        hour12: "ccc MMMM do p",
                      }}
                    />
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
                      <DateTimePicker
                        hourCycle={12}
                        value={field.value ? new Date(field.value) : undefined}
                        {...(field.value && {
                          defaultPopupValue: new Date(field.value),
                        })}
                        onChange={(date) => field.onChange(date?.getTime())}
                        granularity="minute"
                        displayFormat={{
                          hour12: "ccc MMMM do p",
                        }}
                      />
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
            name="location"
            render={({ field }) => {
              const { value, ...props } = field;
              const trigger = (
                <Button
                  {...props}
                  variant="outline"
                  className="w-full justify-start pl-3"
                >
                  <MapPin className="mr-2 size-4 opacity-50" />
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
                    Location <span className="font-light">(optional)</span>
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
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
