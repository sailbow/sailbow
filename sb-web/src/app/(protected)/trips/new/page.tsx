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
import { CalendarIcon } from "lucide-react";

type NewTrip = {
  name: string;
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
    title: "Set dates",
    render: ({ register, errors, formData, control }) => {
      const startDateRegistration = register("startDate");
      return (
        <div>
          <FormField
            control={control}
            name="startDate"
            render={({ field, formState }) => {
              const error = formState.errors.startDate;
              if (error) console.error(error);
              return (
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
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
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={(day) => {
                          field.onChange(day?.getTime());
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              );
            }}
          />
        </div>
      );
    },
  },
};

export default function NewTripPage() {
  return (
    <div className="container mx-auto h-full max-w-2xl py-4">
      <StepperForm steps={steps} onSubmit={(data) => console.log(data)} />
      {/* <CreateTripForm /> */}
    </div>
  );
}
