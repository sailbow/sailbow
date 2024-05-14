"use client";

import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, UsersRound } from "lucide-react";
import { Spinner } from "@/app/_components/spinner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Boat } from "@/lib/schemas/boat";
import { useActiveBoat } from "@/hooks/use-boat";
import { Skeleton } from "@/components/ui/skeleton";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type CrewMember } from "@/lib/common-types";

const TriggerContent = {
  LoadingBoat: <Skeleton className="h-10 bg-gray-300"></Skeleton>,
  BoatLoaded: (
    <Button variant="outline">
      <UserPlus className="mr-2 size-4" />
      Invite
    </Button>
  ),
};

export const roleValueToDisplay = (
  value: CrewMember["role"],
): React.ReactNode => {
  switch (value) {
    case "firstMate":
      return "First Mate";
    case "crewMember":
      return "Crew Member";
    case "captain":
      return "Captain";
  }
};

export default function InviteCrewMember() {
  const { toast } = useToast();
  const { activeBoat } = useActiveBoat();
  const [isOpen, setIsOpen] = useState(false);

  const { isLoading, mutate: inviteCrewMember } =
    api.crew.inviteCrewMember.useMutation({
      onSuccess: () => {
        setIsOpen(false);
        toast({
          title: "Success!",
          description: "The invitation has been sent",
        });
      },
      onError: (error) => {
        console.error(error);
        const message =
          error.data?.code === "BAD_REQUEST"
            ? error.message
            : "Something went wrong sending an invitation, please try again later.";
        toast({
          variant: "destructive",
          title: "Oops!",
          description: message,
        });
      },
    });

  const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    role: z.enum(["firstMate", "crewMember"]),
    boatId: z.number().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "crewMember",
      boatId: -1,
    },
  });

  useEffect(() => {
    if (activeBoat) {
      form.setValue("boatId", activeBoat.id);
    }
  }, [form, activeBoat]);

  const handleSubmit = (
    values: z.infer<typeof formSchema>,
    e?: BaseSyntheticEvent | undefined,
  ) => {
    e?.preventDefault();
    inviteCrewMember(values);
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        if (open) {
          form.reset();
        }
      }}
    >
      <PopoverTrigger onClick={() => setIsOpen(true)} asChild>
        {activeBoat ? TriggerContent.BoatLoaded : TriggerContent.LoadingBoat}
      </PopoverTrigger>
      <PopoverContent
        onInteractOutside={() => setIsOpen(false)}
        onEscapeKeyDown={() => setIsOpen(false)}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col space-y-6"
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
                    <FormMessage />
                  </div>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
            <Button type="submit" disabled={isLoading}>
              Send
              <Spinner isVisible={isLoading} className="ml-2 size-6" />
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
