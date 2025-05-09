"use client";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDisclosure } from "@/lib/use-disclosure";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Step, StepComponent, StepperForm } from "@/components/stepper-form";
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
import BannerModal from "@/app/_components/banner-modal";
import ImageWithLoader from "@/app/_components/image-with-loader";
import { ImageIcon } from "lucide-react";

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
                  autoFocus={false}
                  className={
                    form.formState.errors.name ? "border-destructive" : ""
                  }
                  value={field.value ?? ""}
                  onChange={field.onChange}
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

const DateRangeComponent: StepComponent<typeof DateRangeSchema> = ({
  form,
}) => {
  const isMobile = useIsMobile();
  return (
    <FormField
      control={form.control}
      name="dates"
      render={({ field, formState }) => {
        return (
          <Dialog>
            <FormItem>
              <FormControl>
                <div className="flex w-full items-center gap-4">
                  <DialogTrigger asChild>
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
                  </DialogTrigger>
                  <div className="ml-auto h-8 w-8">
                    {!!field.value?.from && !!field.value?.to && (
                      <Button
                        className="size-full text-foreground"
                        size="icon"
                        variant="ghost"
                        onClick={() => field.onChange({ from: null, to: null })}
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
              <DialogContent className="min-w-fit">
                <Calendar
                  {...field}
                  numberOfMonths={isMobile ? 1 : 2}
                  showOutsideDays={isMobile}
                  mode="range"
                  selected={{
                    from: field.value?.from ?? undefined,
                    to: field.value?.to ?? undefined,
                  }}
                  onSelect={field.onChange}
                />
              </DialogContent>
            </FormItem>
          </Dialog>
        );
      }}
    />
  );
};

const DateRangeStep: Step<typeof DateRangeSchema> = {
  title: "Set a date range (optional)",
  schema: DateRangeSchema,
  defaultValues: {
    dates: {
      from: null,
      to: null,
    },
  },
  component: DateRangeComponent,
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

const CoverPhotoStep: Step<typeof CoverPhotoSchema> = {
  title: "Add a cover photo (optional)",
  schema: CoverPhotoSchema,
  component: ({ form }) => {
    return (
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="banner"
          render={({ field }) => {
            const banner = field.value;
            return (
              <FormItem>
                <FormControl>
                  <div className="flex flex-col space-y-4">
                    <div className="self-start">
                      <BannerModal
                        variant={!!banner ? "edit" : "add"}
                        onBannerChange={(b) => {
                          field.onChange(b);
                        }}
                      />
                    </div>
                    <div className="relative h-40 w-full rounded-md border bg-background">
                      {banner ? (
                        <ImageWithLoader
                          src={banner.regular}
                          alt={banner.alt}
                        />
                      ) : (
                        <ImageIcon
                          className="size-full stroke-gray-300"
                          strokeWidth={0.75}
                        />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>
    );
  },
};

const steps = [
  NameStep,
  DateRangeStep,
  CoverPhotoStep,
] as const as readonly Step[];

const newTripSchema = NameSchema.merge(DateRangeSchema).merge(CoverPhotoSchema);

export const CreateTripButton = () => {
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
        <DialogTitle className="sr-only">Create a trip</DialogTitle>
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
