"use client";
import { useActiveBoat } from "@/hooks/use-boat";
import { api } from "@/trpc/react";
import { useEffect } from "react";
import { type BoatTab } from "./tabs";
import { Button } from "@/components/ui/button";

import {
  Home,
  ListChecks,
  Megaphone,
  Settings,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { bannerSchema } from "@/lib/schemas/boat";
import BoatBannerView from "@/app/_components/boat-banner-view";
import NotFoundPage from "@/app/_components/not-found-page";
import { Spinner } from "@/app/_components/spinner";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    boatId: number;
    tab: BoatTab | null | undefined;
  };
}) {
  const {
    data: boat,
    error,
    isLoading,
  } = api.dock.getBoatById.useQuery(
    {
      boatId: params.boatId,
    },
    {
      retry: false,
    },
  );
  const { activeBoat, setActiveBoat, setError } = useActiveBoat();
  const path = usePathname();

  // Reset active boat on mount
  useEffect(() => {
    if (setActiveBoat) setActiveBoat(null);
  }, [setActiveBoat]);

  useEffect(() => {
    if (boat && setActiveBoat) {
      setActiveBoat(boat);
    }
  }, [boat, setActiveBoat]);

  useEffect(() => {
    if (error) {
      console.error(error);
      if (setError) {
        setError({
          code: error.data?.code ?? "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
    }
  }, [error, setError]);

  if (!isLoading && error && error.data?.code === "NOT_FOUND") {
    return <NotFoundPage />;
  }

  if (isLoading || !activeBoat) {
    return (
      <div className="mt-8 flex w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="size-full">
      {activeBoat && (
        <div className="top-0 h-40 w-full">
          <BoatBannerView banner={bannerSchema.parse(activeBoat)} />
        </div>
      )}

      <div className="h-[calc(theme(spacing.main-height) - 1rem)] flex w-full overflow-y-auto px-2">
        <div className="flex size-full flex-col gap-2 pt-2 sm:flex-row">
          <div className="flex justify-between sm:flex-col sm:justify-normal sm:gap-4">
            <Button
              asChild
              variant="ghost"
              className={clsx("justify-normal", {
                "bg-accent": path.endsWith(params.boatId.toString()),
              })}
            >
              <Link href={`/dock/${params.boatId}`}>
                <Home className="size-4 sm:mr-2" />
                <span className="hidden sm:inline">Overview</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className={clsx("justify-normal", {
                "bg-accent": path.endsWith("itinerary"),
              })}
            >
              <Link href={`/dock/${params.boatId}/itinerary`}>
                <ListChecks className="size-4 sm:mr-2" />
                <span className="hidden sm:inline">Itinerary</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={clsx("justify-normal", {
                "bg-accent": path.endsWith("crew"),
              })}
              asChild
            >
              <Link href={`/dock/${params.boatId}/crew`}>
                <UsersRound className="size-4 sm:mr-2" />
                <span className="hidden sm:inline">Crew</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={clsx("justify-normal", {
                "bg-accent": path.endsWith("announcements"),
              })}
              asChild
            >
              <Link href={`/dock/${params.boatId}/announcements`}>
                <Megaphone className="size-4 flex-none sm:mr-2" />
                <span className="hidden sm:inline">Announcements</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={clsx("justify-normal", {
                "bg-accent": path.endsWith("settings"),
              })}
              asChild
            >
              <Link href={`/dock/${params.boatId}/settings`}>
                <Settings className="size-4 sm:mr-2" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
            </Button>
          </div>
          <div className="grow">{children}</div>
        </div>
      </div>
    </div>
  );
}
