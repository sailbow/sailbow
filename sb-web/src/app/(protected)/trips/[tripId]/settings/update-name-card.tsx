"use client";
import LoadingButton from "@/components/loading-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
} from "@/components/ui/form";
import { toast } from "@/components/ui/toast";
import { useActiveTrip, useActiveTripId } from "@/lib/trip-queries";
import { api } from "@convex/_generated/api";
import { type Id } from "@convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updateNameSchema = z.object({
  tripId: z.custom<Id<"trips">>(),
  name: z.string(),
});

export default function UpdateNameCard() {
  const tripId = useActiveTripId();
  const { data: trip } = useActiveTrip();

  const form = useForm<z.infer<typeof updateNameSchema>>({
    resolver: zodResolver(updateNameSchema),
  });

  useEffect(() => {
    if (!!trip) {
      form.reset({
        tripId: trip._id,
        name: trip.name,
      });
    }
  }, [trip, form]);

  const [isLoading, setIsLoading] = useState(false);
  const updateName = useMutation(
    api.trips.mutations.updateName,
  ).withOptimisticUpdate((updater, args) => {
    const existing = updater.getQuery(api.trips.queries.getById, { tripId });
    if (existing) {
      updater.setQuery(
        api.trips.queries.getById,
        { tripId },
        {
          ...existing,
          name: args.name!,
        },
      );
    }
  });

  const onSubmit = (values: z.infer<typeof updateNameSchema>) => {
    setIsLoading(true);
    updateName(values)
      .then(() => {
        toast.success("Successfully updated the trip name!");
        form.reset();
      })
      .catch((err) => {
        const msg = err instanceof ConvexError ? err.message : undefined;

        toast.error("Something went wrong there, please try again later", {
          description: msg,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Form {...form}>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Name</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full items-center gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <FormInput {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <LoadingButton
              className="ml-auto"
              isLoading={isLoading}
              disabled={!!trip && form.getValues().name === trip.name}
            >
              Update
            </LoadingButton>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
}
