"use client";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Heart, MessageCircle, Trash2 } from "lucide-react";
import { type FunctionReturnType } from "convex/server";
import { type api } from "@convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

type Announcement = FunctionReturnType<
  typeof api.announcements.queries.get
>[number];

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
          <div className="flex gap-1">
            <Button variant="gray_ghost" size="icon">
              <Edit className="h-4 w-4 " />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              className="hover:bg-red-200 focus:bg-red-200 dark:hover:bg-red-400 dark:focus:bg-red-400"
              size="icon"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="prose dark:prose-invert">{announcement.text}</p>
      </CardContent>
      <CardFooter className="px-4 pb-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Like</span>
          </Button>
          <Button variant="ghost" size="icon">
            <MessageCircle className="h-5 w-5" />
            <span className="sr-only">Comment</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
