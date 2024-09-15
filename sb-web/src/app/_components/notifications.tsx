"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Bell, X } from "lucide-react";
import {
  useDismissNotification,
  useUnreadNotifications,
} from "@/lib/notifications";
import CenteredSpinner from "./centered-spinner";
import { Doc, type Id } from "@convex/_generated/dataModel";
import { useInvite } from "@/lib/invitations";
import { PropsWithChildren, useState, useTransition } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Notification = Doc<"notifications">;
type InferNotificationType<TType extends Notification["type"]> = Extract<
  Doc<"notifications">,
  { type: TType }
>;
type InviteNotification = InferNotificationType<"invite">;
type AnnouncementNotification = InferNotificationType<"announcement">;

const NotificationItem = ({
  children,
  notification,
}: PropsWithChildren & { notification: Doc<"notifications"> }) => {
  const { mutate: dismiss } = useDismissNotification({});
  const [dismissClicked, setDismissClicked] = useState(false);
  return (
    <div
      className={cn(
        "relative min-h-16 w-full gap-4 p-2 text-sm outline-none transition-all duration-300 ease-in-out",
        dismissClicked && "-translate-x-full transform opacity-0",
      )}
    >
      <div className="mb-2 flex w-full items-end justify-between">
        <div className="text-xs font-light">
          {new Date(notification._creationTime).toDateString()} @
          {new Date(notification._creationTime).toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
          })}
        </div>
        <Button
          variant="ghost"
          className="size-6 p-0"
          onClick={() => {
            setDismissClicked(true);
            setTimeout(() => {
              dismiss({ notificationId: notification._id });
            }, 300);
          }}
        >
          <X className="size-4" />
        </Button>
      </div>
      {children}
    </div>
  );
};

const NotificationsList = ({
  notifications,
}: {
  notifications: Notification[];
}) => {
  if (notifications.length === 0) {
    return <p className="mt-2 w-full text-center font-light">All caught up!</p>;
  }
  return (
    <div className="grid grid-cols-1 space-y-2 divide-y divide-slate-200">
      {notifications.map(NotificationComponents)}
    </div>
  );
};

const NotificationComponents = (notification: Doc<"notifications">) => {
  switch (notification.type) {
    case "invite":
      return <InviteNotification notification={notification} />;
    case "announcement":
      return;
  }
};

const AnnouncementNotification = ({
  notification,
}: {
  notification: AnnouncementNotification;
}) => {
  return <NotificationItem notification={notification}></NotificationItem>;
};

function InviteNotification({
  notification,
}: {
  notification: InviteNotification;
}) {
  const { data, isLoading } = useInvite(notification.data.inviteId);
  return (
    <NotificationItem key={notification._id} notification={notification}>
      <div className="flex w-full gap-6">
        {data ? (
          <p>
            {data.invitedBy.firstName} has invited you to the trip{" "}
            <span className="font-semibold"> {data.tripName}!</span>
          </p>
        ) : (
          <Skeleton className="h-9 flex-1" />
        )}

        <Link
          href={`/accept-invite/${notification.data.inviteId}`}
          className={buttonVariants({
            className: "ml-auto h-8 hover:underline",
          })}
        >
          View
        </Link>
      </div>
    </NotificationItem>
  );
}

export default function NotificationsDropdown() {
  const { data, isLoading } = useUnreadNotifications();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="relative"
          aria-label="Toggle notifications menu"
        >
          {data && data.length > 0 && (
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
          )}
          <Bell className="size-5 sm:size-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="relative h-[90dvh] w-[300px] overflow-auto p-0 sm:w-[450px]"
        align="end"
      >
        <div className="sticky top-0 z-10 bg-popover p-1">
          <DropdownMenuLabel className="font-medium">
            Notifications
          </DropdownMenuLabel>
        </div>
        <DropdownMenuSeparator className="bg-slate-200" />
        <DropdownMenuGroup className="p-1 pt-0">
          {isLoading || !data ? (
            <CenteredSpinner />
          ) : (
            <NotificationsList notifications={data} />
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
