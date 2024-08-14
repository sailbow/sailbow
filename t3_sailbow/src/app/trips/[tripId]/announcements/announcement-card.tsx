"use client";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Heart, MessageCircle, Trash2, User } from "lucide-react";
import { type Doc } from "@convex/_generated/dataModel";

export default function AnnouncementCard({
  announcement,
}: {
  announcement: Doc<"announcements">;
}) {
  return (
    <Card className="max-w-3xl">
      <CardHeader className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
              <User className="size-6" />
            </div>
            <CardTitle>{announcement.title}</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" className="flex items-center">
              <Edit className="h-4 w-4" />
              <span className="hidden sm:ml-2 sm:inline-flex">Edit</span>
            </Button>
            <Button
              variant="ghost"
              className="hover:bg-red-200 focus:bg-red-200 dark:hover:bg-red-400 dark:focus:bg-red-400"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:ml-2 sm:inline-flex">Delete</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="prose prose-sm dark:prose-invert">{announcement.text}</p>
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
