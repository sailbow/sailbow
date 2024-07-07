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
import { api } from "@/trpc/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useBoat, type ActiveBoat } from "@/hooks/use-boat";
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

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["firstMate", "crewMember"]),
  boatId: z.number().min(1),
});

interface InviteFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function InviteForm({ onSuccess, onCancel }: InviteFormProps) {
  const activeBoat = useBoat();
  const { isLoading, mutateAsync: inviteCrewMember } =
    api.crew.inviteCrewMember.useMutation({
      onError: (error) => {
        console.error(error);
        const message =
          error.data?.code === "BAD_REQUEST"
            ? error.message
            : "Something went wrong sending an invitation, please try again later.";
        toast.dismiss();
        toast.warning(message);
      },
    });

  const defaultValues: z.infer<typeof formSchema> = {
    email: "",
    role: "crewMember",
    boatId: activeBoat.id,
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    toast.promise(inviteCrewMember(values), {
      loading: "Sending...",
      success: () => {
        onSuccess();
        return "The invitation has been sent!";
      },
    });
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
                <Input placeholder="email@example.com" {...field} />
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
            disabled={isLoading}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </div>
      </form>
    </Form>
  );
}
