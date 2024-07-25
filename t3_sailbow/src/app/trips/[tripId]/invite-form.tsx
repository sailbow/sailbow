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
import { useTrip, type ActiveTrip } from "@/lib/use-trip";
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
import { Id } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useState } from "react";
import { FunctionReturnType } from "convex/server";
import { SbError } from "@convex/errorUtils";
import { ConvexError } from "convex/values";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["firstMate", "crewMember"]),
  tripId: z.custom<Id<"trips">>(),
});

interface InviteFormProps {
  tripId: Id<"trips">;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function InviteForm({
  tripId,
  onSuccess,
  onCancel,
}: InviteFormProps) {
  // const { isLoading, mutateAsync: inviteCrewMember } =
  //   api.crew.inviteCrewMember.useMutation({
  //     onError: (error) => {
  //       console.error(error);
  //       const message =
  //         error.data?.code === "BAD_REQUEST"
  //           ? error.message
  //           : "Something went wrong sending an invitation, please try again later.";
  //       toast.dismiss();
  //       toast.warning(message);
  //     },
  //   });

  const [inviting, setInviting] = useState(false);

  const inviteCrewMember = useMutation(api.trips.mutations.inviteCrewMember);
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
    setInviting(true);
    try {
      await inviteCrewMember(values);
      onSuccess();
      toast.success("Success!");
    } catch (err) {
      if (err instanceof ConvexError && err.data.code == "USER_ERROR") {
        toast.dismiss();
        toast.error(err.data.message as string);
      }
    } finally {
      setInviting(false);
    }
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
            disabled={inviting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={inviting}>
            Send
          </Button>
        </div>
      </form>
    </Form>
  );
}
