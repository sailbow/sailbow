"use client";

import type React from "react";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash } from "lucide-react";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import LoadingButton from "./loading-button";

const formSchema = z.object({
  title: z.string().min(1, { message: "Required" }),
  settings: z.object({
    allowMultipleVotes: z.boolean().default(false),
    incognitoResponses: z.boolean().default(false),
  }),
  options: z
    .array(
      z.object({
        value: z.string().min(1, { message: "Required" }),
      }),
    )
    .min(2, { message: "At least two options must be entered" }),
});

export type PollData = z.infer<typeof formSchema>;

interface PollDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onSave: (data: PollData) => void | Promise<unknown>;
  isLoading: boolean;
}

export function PollDialog({
  open,
  onOpenChange,
  title,
  onSave,
  isLoading,
}: PollDialogProps) {
  const form = useForm<PollData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      settings: {
        allowMultipleVotes: false,
        incognitoResponses: true,
      },
      options: [{ value: "" }, { value: "" }],
    },
  });
  const optionsArray = useFieldArray({
    control: form.control,
    name: "options",
  });

  useEffect(() => {
    form.reset();
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] sm:max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="sr-only">Title</FormLabel>
                    <FormControl>
                      <FormInput
                        {...field}
                        placeholder="When do we want to meet?"
                      />
                    </FormControl>
                    <FormMessage className="sr-only" />
                  </FormItem>
                );
              }}
            />
            <div className="flex gap-8">
              <FormField
                control={form.control}
                name="settings.allowMultipleVotes"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormLabel>Allow multiple votes</FormLabel>
                      <FormControl>
                        <Switch
                          name={field.name}
                          ref={field.ref}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          onBlur={field.onBlur}
                          disabled={field.disabled}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="settings.incognitoResponses"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormLabel>Votes visible to others</FormLabel>
                      <FormControl>
                        <Switch
                          name={field.name}
                          ref={field.ref}
                          checked={!field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(!checked)
                          }
                          onBlur={field.onBlur}
                          disabled={field.disabled}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Poll Choices</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    optionsArray.append({ value: "" });
                  }}
                  className="h-8 bg-transparent"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Choice
                </Button>
              </div>

              <div className="max-h-72 space-y-2 overflow-y-scroll p-1">
                {optionsArray.fields.map((opt, index) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`options.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="sr-only">{`Option ${index + 1}`}</FormLabel>
                          <FormControl>
                            <FormInput
                              {...field}
                              id={opt.id}
                              key={opt.id}
                              placeholder={`Choice ${index + 1}`}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => optionsArray.remove(index)}
                      disabled={optionsArray.fields.length <= 2}
                      className="h-8 w-8 p-0 hover:bg-destructive/30"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="mt-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <LoadingButton
                isLoading={form.formState.isSubmitting || isLoading}
                type="submit"
                disabled={form.formState.isSubmitting || isLoading}
              >
                Create Poll
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
