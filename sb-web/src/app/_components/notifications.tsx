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
import { type Doc } from "@convex/_generated/dataModel";
import { useInvite } from "@/lib/invitations";
import { type PropsWithChildren, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTrip } from "@/lib/trip-queries";
import { useDisclosure } from "@/lib/use-disclosure";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { formatRelative } from "date-fns";
type Notification = Doc<"notifications">;
type InferNotificationType<TType extends Notification["type"]> = Extract<
  Doc<"notifications">,
  { type: TType }
>;
type InviteNotification = InferNotificationType<"invite">;
type AnnouncementNotification = InferNotificationType<"announcement">;
type TripPollNotificationData = InferNotificationType<"tripPoll">;

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
          {formatRelative(new Date(notification._creationTime), new Date())}
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
  closeNotifications,
}: {
  notifications: Notification[];
  closeNotifications: () => void;
}) => {
  if (notifications.length === 0) {
    return <p className="mt-2 w-full text-center font-light">All caught up!</p>;
  }
  return (
    <div className="grid grid-cols-1 space-y-2 divide-y divide-secondary">
      {notifications.map((notification) =>
        NotificationComponents({ notification, closeNotifications }),
      )}
    </div>
  );
};

const NotificationComponents = ({
  notification,
  closeNotifications,
}: {
  notification: Doc<"notifications">;
  closeNotifications: () => void;
}) => {
  switch (notification.type) {
    case "invite":
      return <InviteNotification notification={notification} />;
    case "announcement":
      return (
        <AnnouncementNotification
          notification={notification}
          closeNotifications={closeNotifications}
        />
      );
    case "tripPoll":
      return (
        <TripPollNotification
          notification={notification}
          closeNotifications={closeNotifications}
        />
      );
  }
};

const TripPollNotification = ({
  notification,
  closeNotifications,
}: {
  notification: TripPollNotificationData;
  closeNotifications: () => void;
}) => {
  const { data: trip } = useTrip(notification.data.tripId);
  const { mutate: dismissNotification } = useDismissNotification({});
  return (
    <NotificationItem notification={notification}>
      <div className="flex w-full gap-6">
        {trip ? (
          <p>
            {notification.data.postedByName} has created a new poll in <br />
            <span className="font-semibold"> {trip.name}</span>
          </p>
        ) : (
          <Skeleton className="h-9 flex-1" />
        )}
        <Link
          href={`/trips/${notification.data.tripId}?tab=polls`}
          className={buttonVariants({
            className: "ml-auto h-8 hover:underline",
          })}
          onClick={() => {
            closeNotifications();
            dismissNotification({ notificationId: notification._id });
          }}
        >
          View
        </Link>
      </div>
    </NotificationItem>
  );
};

const AnnouncementNotification = ({
  notification,
  closeNotifications,
}: {
  notification: AnnouncementNotification;
  closeNotifications: () => void;
}) => {
  const { data: trip } = useTrip(notification.data.tripId);
  const { mutate: dismissNotification } = useDismissNotification({});
  return (
    <NotificationItem notification={notification}>
      <div className="flex w-full gap-6">
        {trip ? (
          <p>
            {notification.data.announcerName} has posted a new announcement in{" "}
            <br />
            <span className="font-semibold"> {trip.name}</span>
          </p>
        ) : (
          <Skeleton className="h-9 flex-1" />
        )}
        <Link
          href={`/trips/${notification.data.tripId}/announcements`}
          className={buttonVariants({
            className: "ml-auto h-8 hover:underline",
          })}
          onClick={() => {
            closeNotifications();
            dismissNotification({ notificationId: notification._id });
          }}
        >
          View
        </Link>
      </div>
    </NotificationItem>
  );
};

function InviteNotification({
  notification,
}: {
  notification: InviteNotification;
}) {
  const { data } = useInvite(notification.data.inviteId);
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
  const disclosure = useDisclosure();
  const isMobile = useIsMobile();
  return (
    <DropdownMenu {...disclosure}>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton aria-label="Toggle notifications menu">
          <div className="relative mr-2 size-4">
            <Bell className="h-4 w-4" />
            {data && data.length > 0 && (
              <span className="absolute -right-1 -top-1 size-2 rounded-full bg-destructive" />
            )}
          </div>
          Notifications
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="relative z-50 h-[75dvh] w-[300px] overflow-auto p-0 sm:w-[450px]"
        side={isMobile ? "bottom" : "right"}
        align={isMobile ? "end" : "start"}
      >
        <div className="sticky top-0 z-10 bg-popover p-1">
          <DropdownMenuLabel className="font-medium">
            Notifications
          </DropdownMenuLabel>
        </div>
        <DropdownMenuSeparator className="bg-secondary" />
        <DropdownMenuGroup className="p-1 pt-0">
          {isLoading || !data ? (
            <CenteredSpinner />
          ) : (
            <NotificationsList
              notifications={data}
              closeNotifications={disclosure.setClosed}
            />
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
