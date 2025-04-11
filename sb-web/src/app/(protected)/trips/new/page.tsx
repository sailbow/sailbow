"use client";
// import { CreateTripForm } from "@/app/_components/create-trip-form";
// import StepperForm, { type StepConfig } from "@/components/stepper-form";
import { Step, StepperForm, StepSchema } from "@/components/stepper-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarPopover } from "@/components/ui/calendar-popover";
import {
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/toast";
import { useCreateTrip } from "@/lib/trip-mutations";
import { cn } from "@/lib/utils";

import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";

const NameSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(1, { message: "Name is required" }),
  description: z.string().default(""),
});

const NameStep: Step<typeof NameSchema> = {
  title: "Enter a name",
  schema: NameSchema,
  component: ({ form }) => {
    return (
      <FormField
        name="name"
        control={form.control}
        render={({ field }) => {
          return (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="e.g. Summer Vacation"
                />
              </FormControl>
              <div className="relative min-h-4">
                <FormMessage className="absolute left-0 top-0" />
              </div>
            </FormItem>
          );
        }}
      />
    );
  },
};

const DateRangeSchema = z.object({
  dates: z
    .object({
      from: z.date().nullable(),
      to: z.date().nullable(),
    })
    .optional(),
  startDate: z.number().optional(),
  endDate: z.number().optional(),
});

const DateRangeStep: Step<typeof DateRangeSchema> = {
  title: "Set a date range (optional)",
  schema: DateRangeSchema,
  defaultValues: {
    dates: {
      from: null,
      to: null,
    },
  },
  component: ({ form }) => {
    return (
      <FormField
        control={form.control}
        name="dates"
        render={({ field, formState }) => {
          return (
            <Popover>
              <FormItem>
                <FormControl>
                  <div className="flex w-full items-center gap-4">
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "relative w-full justify-start pl-3 text-left font-normal",
                          !field.value?.from && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-4 h-4 w-4 opacity-50" />
                        {field.value?.from && (
                          <span>
                            {format(field.value.from, "PPP")}
                            {" -"}
                          </span>
                        )}
                        {field.value?.to && (
                          <span className="pl-1">
                            {format(field.value.to, "PPP")}
                          </span>
                        )}
                        {!field.value?.from && !field.value?.to && (
                          <span>Set a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <div className="ml-auto h-8 w-8">
                      {!!field.value?.from && !!field.value?.to && (
                        <Button
                          className="size-full text-foreground"
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            field.onChange({ from: null, to: null })
                          }
                        >
                          <X className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </FormControl>
                <div className="relative min-h-4">
                  {formState?.errors.dates && (
                    <div className="absolute left-0 top-0 inline-flex text-xs font-medium italic text-destructive">
                      Must provide a start and end date
                    </div>
                  )}
                </div>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    {...field}
                    mode="range"
                    selected={{
                      from: field.value?.from ?? undefined,
                      to: field.value?.to ?? undefined,
                    }}
                    onSelect={field.onChange}
                  />
                </PopoverContent>
              </FormItem>
            </Popover>
          );
        }}
      ></FormField>
    );
  },
};

const CoverPhotoSchema = z.object({
  banner: z
    .object({
      alt: z.string(),
      small: z.string().url(),
      regular: z.string().url(),
      full: z.string().url(),
      thumbnail: z.string().url(),
    })
    .nullable()
    .default(null),
});

const steps = [NameStep, DateRangeStep] as const as Array<Step>;

const newTripSchema = NameSchema.merge(DateRangeSchema).merge(CoverPhotoSchema);

export default function NewTripPage() {
  const router = useRouter();
  const { mutate: createTrip } = useCreateTrip({
    onSuccess: (data) => {
      toast.success("New trip created");
      router.push(`/trips/${data.tripId}`);
    },
    onError: (error) => {
      toast.error("Something went wrong there");
      console.error(error);
    },
  });
  return (
    <div className="container mx-auto h-full max-w-2xl py-4">
      <StepperForm
        steps={steps}
        onSubmit={(values) => {
          const data = newTripSchema.parse(values);
          const dates =
            !!data.dates?.from && !!data.dates?.to
              ? {
                  start: data.dates.from.getTime(),
                  end: data.dates.to.getTime(),
                }
              : undefined;

          createTrip({
            ...data,
            dates,
          });
        }}
      />
      {/* <CreateTripForm /> */}
    </div>
  );
}
