import React, { useState } from "react";
import {
  useForm,
  type UseFormRegister,
  type FieldErrors,
  type UseFormWatch,
  type UseFormSetValue,
  type UseFormGetValues,
  type Control,
  type FieldValues,
  type DefaultValues,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Types
interface FormProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  getValues: UseFormGetValues<T>;
  control: Control<T>;
  formData: Partial<T>;
}

export interface StepConfig<T extends FieldValues> {
  title: string;
  render: (formProps: FormProps<T>) => React.ReactNode;
}

export interface StepperFormProps<T extends FieldValues> {
  steps: Record<string, StepConfig<T>>;
  onSubmit: (data: T) => void;
  defaultValues?: DefaultValues<T>;
  submitButtonText?: string;
}

// Generic StepperForm component
function StepperForm<T extends FieldValues>({
  steps,
  onSubmit,
  defaultValues = {} as DefaultValues<T>,
  submitButtonText = "Submit",
}: StepperFormProps<T>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(defaultValues);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    control,
  } = useForm<T>({
    defaultValues: defaultValues,
  });

  const stepKeys = Object.keys(steps);
  const currentStepKey = stepKeys[currentStep];
  const currentStepConfig = steps[currentStepKey];

  const handleFormSubmit = (data: T) => {
    onSubmit(data);
  };

  const nextStep = () => {
    const values = getValues();
    setFormData((prev) => ({ ...prev, ...values }));
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const StepIndicator = () => {
    return (
      <div className="mb-6 flex justify-center">
        {stepKeys.map((key, index) => (
          <div key={key} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                index === currentStep
                  ? "bg-blue-600 text-white"
                  : index < currentStep
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              {index < currentStep ? "✓" : index + 1}
            </div>
            {index < stepKeys.length - 1 && (
              <div
                className={`h-1 w-12 ${index < currentStep ? "bg-green-500" : "bg-gray-200"}`}
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const formProps: FormProps<T> = {
    register,
    errors,
    watch,
    setValue,
    getValues,
    control,
    formData,
  };

  return (
    <div className="mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>{currentStepConfig.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <StepIndicator />
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            {currentStepConfig.render(formProps)}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          {currentStep < stepKeys.length - 1 ? (
            <Button type="button" onClick={handleSubmit(nextStep)}>
              Next
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit(handleFormSubmit)}>
              {submitButtonText}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default StepperForm;
