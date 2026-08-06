"use client";
import { cn } from "@/lib/utils";
import {
  Anchor,
  ChevronUp,
  Home,
  ListChecks,
  Megaphone,
  X,
  type LucideIcon,
} from "lucide-react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { Id } from "@convex/_generated/dataModel";
import { useMemo, useState } from "react";
import ActiveTripSidebarGroup from "@/components/active-trip-sidebar-group";
import TripSearch from "@/app/_components/trip-search";
import { Drawer, DrawerContent, DrawerFooter } from "@/components/ui/drawer";
import { DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import NotificationsDropdown, {
  MobileNotifications,
} from "@/app/_components/notifications";

type MobileTab = {
  id: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
};
export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-0 sm:p-6">
      <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background sm:h-[760px] sm:max-w-[400px] sm:rounded-[2.5rem] sm:border sm:border-border sm:shadow-xl">
        <main className="flex-1 overflow-y-auto pb-2">{children}</main>
        <MobileNav />
      </div>
    </div>
  );
}

const MobileNav = () => {
  const router = useRouter();
  const { tripId } = useParams<{ tripId?: Id<"trips"> }>();
  const pathname = usePathname();

  const rootTripPath = `/trips/${tripId}`;

  const primaryTabs: MobileTab[] = useMemo(
    () => [
      {
        id: "home",
        label: "Home",
        onClick: () => {
          router.push(rootTripPath);
        },
        isActive: pathname === rootTripPath,
        icon: Home,
      },
      {
        id: "itinerary",
        label: "Itinerary",
        onClick: () => {
          router.push(`${rootTripPath}/itinerary`);
        },
        isActive: pathname.startsWith(`${rootTripPath}/itinerary`),
        icon: ListChecks,
      },
      {
        id: "announcements",
        label: "Announcements",
        onClick: () => {
          router.push(`${rootTripPath}/announcements`);
        },
        isActive: pathname.startsWith(`${rootTripPath}/announcements`),
        icon: Megaphone,
      },
    ],
    [router, pathname, rootTripPath],
  );

  const [expandOpen, setExpandOpen] = useState(false);

  return (
    <>
      <ExpandMoreContent open={expandOpen} setOpen={setExpandOpen} />
      <nav
        aria-label="Primary"
        className="z-30 flex shrink-0 items-stretch justify-around border-t border-border bg-card px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2"
      >
        {primaryTabs.map((tab) => {
          return <TabButton key={tab.id} tab={tab} />;
        })}
        <button
          type="button"
          onClick={() => setExpandOpen((v) => !v)}
          aria-expanded={expandOpen}
          aria-haspopup="dialog"
          className={cn(
            "flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-xs font-medium transition-colors",
            expandOpen
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <ChevronUp
            className={cn(
              "size-5 transition-transform duration-300",
              expandOpen && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>
      </nav>
    </>
  );
};

const TabButton = ({ tab }: { tab: MobileTab }) => {
  return (
    <button
      key={tab.id}
      type="button"
      onClick={tab.onClick}
      className={cn(
        "flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-xs font-medium transition-colors",
        tab.isActive
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <span className="sr-only">{tab.label}</span>
      <tab.icon className="size-5" aria-hidden="true" />
    </button>
  );
};

const ExpandMoreContent = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const router = useRouter();
  const { tripId } = useParams<{ tripId?: Id<"trips"> }>();
  const rootTripPath = `/trips/${tripId}`;
  const pathname = usePathname();
  const tripMoreOptions: MobileTab[] = useMemo(
    () => [
      {
        id: "home",
        label: "Home",
        onClick: () => {
          router.push(rootTripPath);
        },
        isActive: pathname === rootTripPath,
        icon: Home,
      },
      {
        id: "itinerary",
        label: "Itinerary",
        onClick: () => {
          router.push(`${rootTripPath}/itinerary`);
        },
        isActive: pathname.startsWith(`${rootTripPath}/itinerary`),
        icon: ListChecks,
      },
      {
        id: "announcements",
        label: "Announcements",
        onClick: () => {
          router.push(`${rootTripPath}/announcements`);
        },
        isActive: pathname.startsWith(`${rootTripPath}/announcements`),
        icon: Megaphone,
      },
    ],
    [router, pathname, rootTripPath],
  );
  const generalMoreOptions: MobileTab[] = useMemo(
    () => [
      {
        id: "my-trips",
        label: "My Trips",
        onClick: () => {
          router.push("/trips");
        },
        isActive: false,
        icon: Anchor,
      },
    ],
    [router],
  );
  if (!tripId) return;

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="h-[90vh]">
        <DialogTitle className="sr-only">More</DialogTitle>
        <div className="flex items-center gap-4 px-5 pb-2 pt-4">
          <TripSearch variant="base" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close more options"
            className="ml-auto flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <ul className="grid grid-cols-1 gap-1 px-3">
          {tripMoreOptions.map((opt) => (
            <li key={opt.label}>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  opt.onClick();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-medium text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground hover:bg-card hover:text-card-foreground">
                  <opt.icon className="size-4" aria-hidden="true" />
                </span>
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
        <Separator className="my-2" />
        <ul className="grid grid-cols-1 gap-1 px-3 pb-6">
          {generalMoreOptions.map((opt) => (
            <li key={opt.label}>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  opt.onClick();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-medium text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <opt.icon className="size-4" aria-hidden="true" />
                </span>
                {opt.label}
              </button>
            </li>
          ))}
          <MobileNotifications />
        </ul>

        <DrawerFooter>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setOpen(false)}
            className="w-fit"
          >
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
