"use client";
import BoatBannerView from "@/app/_components/boat-banner-view";
import BoatPageHeader from "@/app/_components/boat-page-header";
import { Navbar } from "@/app/_components/nav-bar";
import { Spinner } from "@/app/_components/spinner";
import { Button } from "@/components/ui/button";
import { type Boat, type BoatBanner, bannerSchema } from "@/lib/schemas/boat";
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { type ActiveBoat, useActiveBoat } from "@/hooks/use-boat";
import { type CrewMember } from "@/lib/common-types";
import InviteCrewMember from "./invite";
import Link from "next/link";

export default function Page() {
  const [banner, setBanner] = useState<BoatBanner | undefined>(undefined);
  const { activeBoat, error } = useActiveBoat();

  const { toast } = useToast();

  useEffect(() => {
    if (activeBoat) {
      setBanner(bannerSchema.parse(activeBoat));
    }
  }, [activeBoat]);

  useEffect(() => {
    if (error) {
      console.error(error);
      if (error.code !== "NOT_FOUND") {
        toast({
          variant: "destructive",
          title: "Oops!",
          description: "Something went wrong, please try again later.",
        });
      }
    }
  }, [error, toast]);

  if (error && error.code === "NOT_FOUND") {
    return (
      <div className="flex h-dvh w-dvw flex-col overflow-y-auto bg-muted/40">
        <Navbar />
        <div className="flex w-full flex-col items-center justify-center p-10">
          <h1 className="text-4xl font-light">404 Not Found</h1>
          <Button variant="outline" size="lg" asChild>
            <Link href="/dock">Back to my boats</Link>
          </Button>
        </div>
      </div>
    );
  }
  if (!banner && !activeBoat) {
    return (
      <div className="flex h-dvh w-dvw items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }
  return (
    <div className="fixed inset-0 top-0 flex h-dvh w-dvw bg-muted/40">
      <aside className="hidden w-1/3 min-w-[200px] overflow-y-auto border-r-[1px] border-border/40 p-4 lg:flex lg:flex-col">
        <div className="h-[200px] self-stretch">
          {banner && <BoatBannerView banner={banner} />}
        </div>
        <h3 className="text-2xl">{activeBoat?.name}</h3>
        <p className="leading-none">{activeBoat?.description}</p>
        <Separator className="my-4" />
        <InviteCrewMember />
      </aside>
      <div className="ml-auto flex-1 overflow-y-auto">
        <Navbar>
          <BoatPageHeader boat={activeBoat as Boat} />
        </Navbar>
        <div className="flex flex-col items-center space-y-2 pt-2">
          <div className="flex w-full items-center justify-center gap-2">
            <Button variant="outline" size="lg">
              Add Date
            </Button>
            <Button variant="outline" size="lg">
              Add Location
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
