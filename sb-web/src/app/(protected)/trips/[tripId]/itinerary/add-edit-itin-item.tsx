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
import { useEffect } from "react";
import { type ItinItem, ItinItemSchema, type OptionalItinItem } from "./schema";

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

  const calendarDisclosure = useDisclosure();

  const form = useForm<ItinItem>({
    resolver: zodResolver(ItinItemSchema),
    defaultValues: {
      _id: item?._id,
      tripId: activeTripId,
      title: item?.title ?? "",
      date: item?.date ? item.date : undefined,
      time: item ? item.time : null,
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
        date: item.date ? item.date : undefined,
        time: item.time,
        location: item.location,
        details: item.details,
      });
    } else {
      form.reset();
    }
  }, [disclosure.open, form, item, activeTripId]);

  const onSubmit = (values: ItinItem) => {
    upsertItinItem({
      ...values,
      date: values.date.getTime(),
    });
  };

  const isEditing = !!item?._id;
  return (
    <Dialog {...disclosure}>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-4"
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
            <FormField
              control={form.control}
              name="date"
              render={({ field, formState }) => {
                const error = formState.errors.date;
                if (error) console.error(error);
                return (
                  <FormItem>
                    <FormLabel className="sr-only">Date</FormLabel>
                    <Popover {...calendarDisclosure}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                              error ? "border-destructive" : "",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(day) => {
                            field.onChange(day);
                            calendarDisclosure.setClosed();
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                );
              }}
            />
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
            <DialogFooter className="mt-4">
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
