"use client";
import TripCard from "@/app/_components/trip-card";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { CalendarIcon, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserTrips } from "@/lib/trip-queries";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDisclosure } from "@/lib/use-disclosure";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Step, StepperForm } from "@/components/stepper-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useCreateTrip } from "@/lib/trip-mutations";
import { toast } from "@/components/ui/toast";

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

const CreateTripButton = () => {
  const isMobile = useIsMobile();
  const disclosure = useDisclosure();
  const router = useRouter();
  const { mutateAsync: createTrip } = useCreateTrip({
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
    <Dialog {...disclosure}>
      <DialogTrigger asChild>
        <Button
          size={isMobile ? "sm" : "default"}
          className="max-xs:size-10 max-xs:rounded-full"
        >
          <Plus className="h-6 w-6 xs:mr-2" />
          <span className="hidden xs:inline-flex">Create a trip</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <StepperForm
          steps={steps}
          onSubmit={async (values) => {
            const data = newTripSchema.parse(values);
            const dates =
              !!data.dates?.from && !!data.dates?.to
                ? {
                    start: data.dates.from.getTime(),
                    end: data.dates.to.getTime(),
                  }
                : undefined;

            await createTrip({
              ...data,
              dates,
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default function TripsPage() {
  const { data: trips, isPending } = useUserTrips();

  return (
    <div className="container relative mx-auto min-h-dvh">
      <div className="container sticky top-0 z-50 mx-auto flex min-h-12 items-center justify-between bg-background py-3">
        <div className="inline-flex break-normal text-2xl font-semibold leading-none tracking-tight sm:text-3xl">
          Trips
        </div>
        <CreateTripButton />
      </div>
      {isPending && (
        <div className="grid grid-cols-1 gap-6 overflow-hidden p-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="h-[250px] overflow-hidden">
              <Skeleton className="size-full bg-slate-300" />
            </Card>
          ))}
        </div>
      )}
      {!isPending && !!trips && trips.length === 0 && (
        <div className="flex w-full items-center justify-center">
          <Card className="mt-4 flex h-[50dvh] w-full flex-col items-center justify-center gap-10 p-4">
            <h3 className="text-2xl leading-none tracking-tight">
              No trips created yet!
            </h3>
            <CreateTripButton />
          </Card>
        </div>
      )}
      {!isPending && !!trips && (
        <div className="grid grid-cols-1 gap-6 overflow-hidden p-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip?._id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
