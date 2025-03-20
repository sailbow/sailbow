"use client";
// import { CreateTripForm } from "@/app/_components/create-trip-form";
import StepperForm, { type StepConfig } from "@/components/stepper-form";
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
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDisclosure } from "@/lib/use-disclosure";
import { cn } from "@/lib/utils";

import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";

type NewTrip = {
  name: string;
  dates: {
    from: Date | undefined;
    to: Date | undefined;
  };
  startDate: number;
  endDate: number;
};

const steps: Record<string, StepConfig<NewTrip>> = {
  name: {
    title: "Choose a name",
    render: ({ register, errors, formData }) => {
      return (
        <Input
          id="name"
          {...register("name", { required: "Name is required!" })}
          defaultValue={formData.name ?? ""}
          placeholder="Enter a name"
        />
      );
    },
  },
  dates: {
    title: "Set a date range (optional)",
    render: ({ formData, control }) => {
      return (
        <FormField
          control={control}
          name="dates"
          render={({ field, formState }) => {
            return (
              <Popover>
                <FormControl>
                  <div className="flex w-full items-center gap-4">
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "relative w-full justify-start pl-3 text-left font-normal",
                          !field.value.from && "text-muted-foreground",
                          formState.errors.dates ? "border-destructive" : "",
                        )}
                      >
                        <CalendarIcon className="mr-4 h-4 w-4 opacity-50" />
                        {field.value.from && (
                          <span>
                            {format(field.value.from, "PPP")}
                            {" -"}
                          </span>
                        )}
                        {field.value.to && (
                          <span className="pl-1">
                            {format(field.value.to, "PPP")}
                          </span>
                        )}
                        {!field.value.from && !field.value.to && (
                          <span>Set a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <div className="ml-auto h-8 w-8">
                      {!!field.value.from && !!field.value.to && (
                        <Button
                          className="size-full text-foreground"
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            field.onChange({ from: undefined, to: undefined })
                          }
                        >
                          <X className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </FormControl>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                </PopoverContent>
              </Popover>
            );
          }}
        ></FormField>
      );
    },
  },
};

export default function NewTripPage() {
  return (
    <div className="container mx-auto h-full max-w-2xl py-4">
      <StepperForm
        steps={steps}
        defaultValues={{ name: "", dates: {} }}
        onSubmit={(data) => console.log(data)}
      />
      {/* <CreateTripForm /> */}
    </div>
  );
}
