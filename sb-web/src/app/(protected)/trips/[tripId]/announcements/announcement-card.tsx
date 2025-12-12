"use client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { type FunctionReturnType } from "convex/server";
import { type api } from "@convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useDisclosure } from "@/lib/use-disclosure";
import { useDeleteAnnouncement } from "@/lib/announcements";
import { toast } from "@/components/ui/toast";
import { ConvexError } from "convex/values";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TextEditor } from "@/components/text-editor";
import LoadingButton from "@/components/loading-button";
import {
  RD,
  RDContent,
  RDDescription,
  RDFooter,
  RDHeader,
  RDTitle,
  RDTrigger,
} from "@/components/ui/responsive-dialog";

type Announcement = FunctionReturnType<
  typeof api.announcements.queries.get
>[number];

const DeleteAnnouncementModal = ({
  announcement,
}: {
  announcement: Announcement;
}) => {
  const disclosure = useDisclosure();
  const {
    mutate: deleteAnnouncement,
    isPending,
    isSuccess: wasDeleted,
  } = useDeleteAnnouncement({
    onSuccess: () => {
      disclosure.setClosed();
      toast.success("Successfully deleted announcement");
    },
    onError: (error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error instanceof ConvexError && error.data.code === "USER_ERROR") {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        toast.error(error.data.message);
      } else {
        console.error(error);
        toast.error("Something went wrong there, please try again later");
      }
    },
  });

  return (
    <RD {...disclosure}>
      <RDTrigger>
        <Button variant="ghost" size="icon" className="hover:bg-destructive/30">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </RDTrigger>
      <RDContent>
        <RDHeader>
          <RDTitle>Are you sure you want to delete this announcement?</RDTitle>
          <RDDescription>This action cannot be undone!</RDDescription>
        </RDHeader>
        <RDFooter>
          <Button variant="outline" onClick={disclosure.setClosed}>
            Cancel
          </Button>
          <LoadingButton
            variant="destructive"
            isLoading={isPending}
            onClick={() =>
              deleteAnnouncement({
                tripId: announcement.tripId,
                announcementId: announcement._id,
              })
            }
            disabled={isPending || wasDeleted}
          >
            Delete
          </LoadingButton>
        </RDFooter>
      </RDContent>
    </RD>
  );
};

export default function AnnouncementCard({
  announcement,
}: {
  announcement: Announcement;
}) {
  return (
    <Card className="max-w-2xl">
      <CardHeader className="px-2 pt-2 sm:px-4 sm:pt-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={announcement.createdByUser.imageUrl} />
              <AvatarFallback>
                <Skeleton className="size-full rounded-full" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm sm:text-xl">
                {`${announcement.createdByUser.firstName} ${announcement.createdByUser.lastName}`}
              </CardTitle>
              <div className="text-xs text-muted-foreground">
                {new Date(announcement._creationTime).toDateString()} @
                {new Date(announcement._creationTime).toLocaleTimeString(
                  undefined,
                  { hour: "numeric", minute: "2-digit" },
                )}
              </div>
            </div>
          </div>
          <DeleteAnnouncementModal announcement={announcement} />
        </div>
      </CardHeader>
      <CardContent>
        <TextEditor isEditable={false} content={announcement.text} />
      </CardContent>
    </Card>
  );
}
