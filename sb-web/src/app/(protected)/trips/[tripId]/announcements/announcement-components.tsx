"use client";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useCreateAnnouncement } from "@/lib/trip-mutations";
import { useActiveTripId } from "@/lib/trip-queries";
import { useAnnouncements } from "@/lib/announcements";
import { useDisclosure } from "@/lib/use-disclosure";
import { cn } from "@/lib/utils";
import { type Id } from "@convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConvexError } from "convex/values";
import { Megaphone } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AnnouncementCard from "./announcement-card";

const createAnnouncementSchema = z.object({
  tripId: z.custom<Id<"trips">>(),
  text: z.string().min(1, "Required"),
});
type CreateAnnouncement = z.infer<typeof createAnnouncementSchema>;

export const CreateAnnouncementButton = () => {
  const activeTripId = useActiveTripId();
  const disclosure = useDisclosure();

  const { mutate: createAnnouncement, isPending } = useCreateAnnouncement({
    onSuccess: () => {
      toast.success("Announcement posted!");
      disclosure.setClosed();
    },
    onError: (error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error instanceof ConvexError && error.data?.code === "USER_ERROR") {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        toast.error(error.data.message);
      } else {
        toast.error("Something went wrong there, please try again later");
      }
    },
  });
  const form = useForm<CreateAnnouncement>({
    resolver: zodResolver(createAnnouncementSchema),
    defaultValues: {
      tripId: activeTripId,
    },
  });

  const onSubmit = (values: CreateAnnouncement) => {
    createAnnouncement(values);
  };

  return (
    <Dialog {...disclosure}>
      <DialogTrigger asChild>
        <Button onClick={() => form.reset()}>
          <Megaphone className="size-6 xs:mr-2" />
          <span className="hidden xs:inline-flex">Create announcement</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col"
          >
            <DialogHeader>
              <DialogTitle>New announcement</DialogTitle>
            </DialogHeader>
            <FormField
              control={form.control}
              name="text"
              render={({ field, formState }) => {
                const error = formState.errors.text;

                return (
                  <FormItem>
                    <div className="mt-1 flex max-h-4 min-h-4 items-center gap-4">
                      <FormLabel className="sr-only">
                        Announcement input
                      </FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Textarea
                        className={cn(
                          "mt-4 max-h-[50dvh] min-h-32",
                          error ? "border-destructive" : "",
                        )}
                        placeholder="What would you like to say?"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <DialogFooter className="mt-4">
              <DialogClose>
                <Button type="button" variant="secondary" disabled={isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                Post
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const AnnouncementList = () => {
  const { data: announcements, isLoading } = useAnnouncements();
  if (isLoading) {
    return (
      <div className="mt-4 grid w-full grid-cols-1 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="max-w-2xl">
            <CardHeader className="px-4 pt-4">
              <div className="flex w-full items-center gap-2">
                <Avatar>
                  <Skeleton className="size-full rounded-full" />
                </Avatar>
                <Skeleton className="h-10 flex-1" />
              </div>
            </CardHeader>
            <CardContent className="h-32 w-full">
              <Skeleton className="size-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  if (!announcements) return;

  return (
    <div className="mt-4 grid w-full grid-cols-1 gap-4">
      {announcements.map((a) => (
        <AnnouncementCard key={a._id} announcement={a} />
      ))}
    </div>
  );
};
