/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { roleValueToDisplay } from "./invite";
import { type Id } from "@convex/_generated/dataModel";
import { ConvexError } from "convex/values";
import { useInviteCrewMember } from "@/lib/trip-mutations";
import { useActiveTripId } from "@/lib/trip-queries";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["firstMate", "crewMember"]),
  tripId: z.custom<Id<"trips">>(),
});

interface InviteFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function InviteForm({ onSuccess, onCancel }: InviteFormProps) {
  const tripId = useActiveTripId();
  const { mutate: inviteCrewMember, isPending } = useInviteCrewMember({
    onSuccess: () => {
      toast.success("Invite sent!");
      onSuccess();
    },
    onError: (error) => {
      if (error instanceof ConvexError && error.data?.code === "USER_ERROR") {
        toast.error(error.data?.message);
      } else {
        toast.error("Something went wrong there, please try again later");
      }
    },
  });
  const defaultValues: z.infer<typeof formSchema> = {
    email: "",
    role: "crewMember",
    tripId: tripId,
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    inviteCrewMember(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-4">
                <FormLabel className="text-foreground">Email</FormLabel>
                <FormMessage className="text-xs" />
              </div>
              <FormControl>
                <Input
                  placeholder="email@example.com"
                  {...field}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-4">
                <FormLabel className="text-foreground">Role</FormLabel>
              </div>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={roleValueToDisplay(field.value)}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="crewMember">Crew Member</SelectItem>
                  <SelectItem value="firstMate">First Mate</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <div className="flex w-full items-center justify-end space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            Send
          </Button>
        </div>
      </form>
    </Form>
  );
}
