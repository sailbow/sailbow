"use client";

import type React from "react";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form } from "./ui/form";
import { Spinner } from "@/app/_components/spinner";

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
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      try {
        await onSubmit({ ...formData, ...currentValues });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle back
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

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
    <div className="w-full max-w-lg">
      <div className="flex flex-col space-y-1.5 py-6">
        <StepIndicator />
        <h3 className="text-2xl font-normal leading-none tracking-tight">
          {steps[activeStep].title}
        </h3>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleStepSubmit)}
          className="space-y-4"
        >
          <currentStep.component form={form} />

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {backButtonText}
            </Button>
            <Button type="submit" className="min-w-max">
              {isLoading ? (
                <Spinner />
              ) : activeStep === steps.length - 1 ? (
                submitButtonText
              ) : (
                nextButtonText
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
