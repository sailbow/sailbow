"use client";

import type React from "react";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "./ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export type StepSchema = z.AnyZodObject;

export type StepRender<T extends StepSchema = StepSchema> = (
  form: ReturnType<typeof useForm<z.infer<T>>>,
) => React.ReactNode;

export type StepComponent<T extends StepSchema = StepSchema> = React.FC<{
  form: ReturnType<typeof useForm<z.infer<T>>>;
}>;

export interface Step<T extends StepSchema = StepSchema> {
  title: string;
  description?: string;
  schema: T;
  defaultValues?: Partial<z.infer<T>>;
  component: StepComponent<T>;
}

export interface StepperFormProps {
  steps: readonly Step[];
  onSubmit: (values: Record<string, unknown>) => void;
  submitButtonText?: string;
  nextButtonText?: string;
  backButtonText?: string;
  className?: string;
}

export function StepperForm({
  steps,
  onSubmit,
  submitButtonText = "Submit",
  nextButtonText = "Next",
  backButtonText = "Back",
  className,
}: StepperFormProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const currentStep = steps[activeStep];
  // Create form with the current step's schema
  const form = useForm<z.infer<typeof currentStep.schema>>({
    resolver: zodResolver(currentStep.schema),
    defaultValues: currentStep.schema ?? {},
  });

  // Handle next step
  const handleStepSubmit = async () => {
    const isValid = await form.trigger();

    if (!isValid) return;

    // Save current step data
    const currentValues = form.getValues();

    if (activeStep < steps.length - 1) {
      setFormData((prev) => ({ ...prev, ...currentValues }));
      setActiveStep((prev) => prev + 1);
    } else {
      onSubmit({ ...formData, ...currentValues });
    }
  };

  // Handle back
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  useEffect(() => console.log(formData), [formData]);

  const StepIndicator = () => {
    return (
      <div className="mb-6 flex justify-center">
        {steps.map((_, index) => (
          <div key={`step-${index}`} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                index === activeStep
                  ? "bg-sky-500 text-white"
                  : index < activeStep
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {index < activeStep ? "✓" : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 w-12 ${index < activeStep ? "bg-primary" : "bg-muted"}`}
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className={cn("mx-auto w-full max-w-lg", className)}>
      <CardHeader>
        <StepIndicator />
        <CardTitle>{steps[activeStep].title}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleStepSubmit)}>
          <CardContent>
            <currentStep.component form={form} />
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {backButtonText}
            </Button>
            <Button type="submit">
              {activeStep === steps.length - 1
                ? submitButtonText
                : nextButtonText}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
