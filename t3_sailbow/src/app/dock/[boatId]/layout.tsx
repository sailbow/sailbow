"use client";
import { useActiveBoat } from "@/hooks/use-boat";
import { api } from "@/trpc/react";
import { useEffect } from "react";
import { BoatTab } from "./tabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button, buttonVariants } from "@/components/ui/button";

import {
  createLucideIcon,
  Home,
  IconNode,
  ListChecks,
  LucideIcon,
  Megaphone,
  Settings,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { bannerSchema } from "@/lib/schemas/boat";
import BoatBannerView from "@/app/_components/boat-banner-view";
import NotFoundPage from "@/app/_components/not-found-page";
import { Spinner } from "@/app/_components/spinner";

interface TabButtonProps {
  iconName: string;
  text: BoatTab;
  href: string;
}

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
        <div className="flex size-full flex-col gap-x-4 px-2 pt-2 sm:flex-row">
          <div className="flex justify-between sm:flex-col sm:justify-normal">
            <Button variant="ghost" className="justify-start" asChild>
              <Link href={`/dock/${params.boatId}`}>
                <Home className="size-4 sm:mr-2" />
                <span className="hidden sm:inline">Overview</span>
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link href={`/dock/${params.boatId}/itinerary`}>
                <ListChecks className="size-4 sm:mr-2" />
                <span className="hidden sm:inline">Itinerary</span>
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link href={`/dock/${params.boatId}/crew`}>
                <UsersRound className="size-4 sm:mr-2" />
                <span className="hidden sm:inline">Crew</span>
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link href={`/dock/${params.boatId}/announcements`}>
                <Megaphone className="size-4 flex-none sm:mr-2" />
                <span className="hidden sm:inline">Announcements</span>
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link href={`/dock/${params.boatId}/settings`}>
                <Settings className="size-4 sm:mr-2" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
            </Button>
          </div>
          <div className="flex grow px-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
