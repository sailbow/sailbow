"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useUpsertItinItem } from "@/lib/trip-mutations";
import { useActiveTripId } from "@/lib/trip-queries";
import { type Disclosure, useDisclosure } from "@/lib/use-disclosure";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConvexError } from "convex/values";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { type ItinItem, ItinItemSchema, type OptionalItinItem } from "./schema";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { enUS } from "date-fns/locale";

export const AddOrEditItinItem = ({
  disclosure,
  item,
}: {
  disclosure: Disclosure;
  item?: OptionalItinItem;
}) => {
  const activeTripId = useActiveTripId();
  const { mutate: upsertItinItem, isPending } = useUpsertItinItem({
    onSuccess: (_, variables) => {
      disclosure.setClosed();
      toast.success(`Itinerary item ${!!variables._id ? "updated" : "added"}!`);
    },
    onError: (error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error instanceof ConvexError && error.data?.code === "USER_ERROR") {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        toast.error(error.data.message);
      } else {
        toast.error("Something went wrong there, please try again later");
      }
    },
  });

  console.log(item);

  const form = useForm<ItinItem>({
    resolver: zodResolver(ItinItemSchema),
    defaultValues: {
      _id: item?._id,
      tripId: activeTripId,
      title: item?.title ?? "",
      start: item?.start ?? undefined,
      end: item?.end ?? undefined,
      location: item ? item.location : null,
      details: item?.details ?? "",
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        _id: item._id,
        tripId: activeTripId,
        title: item.title ?? "",
        location: item.location,
        details: item.details,
        start: item.start ?? undefined,
        end: item.end ?? undefined,
      });
    } else {
      form.reset();
    }
  }, [disclosure.open, form, item, activeTripId]);

  const onSubmit = (values: ItinItem) => {
    upsertItinItem(values);
  };

  const isEditing = !!item?._id;
  return (
    <Dialog {...disclosure}>
      <DialogContent className="h-[75dvh] overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col space-y-4"
          >
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit itinerary item" : "New itinerary item"}
              </DialogTitle>
            </DialogHeader>
            <FormField
              control={form.control}
              name="title"
              render={({ field, formState }) => {
                const error = formState.errors.title;
                return (
                  <FormItem>
                    <FormLabel className="sr-only">Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className={cn(
                          "",
                          !field.value && "font-light",
                          error ? "border-destructive" : "",
                        )}
                        placeholder="Add title..."
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <div className="flex w-full items-center gap-2">
              <FormField
                control={form.control}
                name="start"
                render={({ field, formState }) => {
                  const error = formState.errors.start;
                  if (error) console.error(error);
                  return (
                    <FormItem className="flex-1">
                      <FormLabel className="sr-only">Start Date</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          onChange={(date) =>
                            field.onChange(date?.toISOString())
                          }
                          value={
                            field.value ? new Date(field.value) : undefined
                          }
                          hourCycle={12}
                          granularity="minute"
                          locale={enUS}
                          placeholder="Start date"
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="start"
                render={({ field, formState }) => {
                  const error = formState.errors.end;
                  if (error) console.error(error);
                  return (
                    <FormItem className="flex-1">
                      <FormLabel className="sr-only">End Date</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          className={cn(
                            "shrink-0",
                            error && "border-destructive",
                          )}
                          onChange={(date) =>
                            field.onChange(date?.toISOString())
                          }
                          value={
                            field.value ? new Date(field.value) : undefined
                          }
                          hourCycle={12}
                          granularity="minute"
                          locale={enUS}
                          placeholder="End date"
                          displayFormat={{ hour12: "" }}
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
            </div>

            <FormField
              control={form.control}
              name="details"
              render={({ field, formState }) => {
                const error = formState.errors.details;
                return (
                  <FormItem>
                    <FormLabel className="sr-only">
                      Details (optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ""}
                        className={cn(
                          "mt-4 max-h-[50dvh] min-h-32 whitespace-pre",
                          error ? "border-destructive" : "",
                          !field.value && "font-light",
                        )}
                        placeholder="Additional details..."
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <DialogFooter className="mt-auto">
              <DialogClose>
                <Button type="button" variant="secondary" disabled={isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
