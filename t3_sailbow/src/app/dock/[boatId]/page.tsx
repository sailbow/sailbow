"use client"
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

export default function Page({ params }: { params: { boatId: number } }) {
  const { error, data: boat } = api.dock.getBoatById.useQuery(params)
  const [banner, setBanner] = useState<BoatBanner | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    if (boat) {
      setBanner(bannerSchema.parse(boat));
    }

  }, [boat]);

  useEffect(() => {
    if (error) {
      console.error(error.message);
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Something went wrong, please try again later."
      })
    }
  }, [error, toast]);

  if (!banner && !boat) {
    return (
      <div className="h-dvh w-dvw flex items-center justify-center">
        <Spinner className="size-10" />
      </div>
    )
  }
  return (
    <div className="bg-background">
      <div className="fixed top-0 inset-0 flex h-dvh w-dvw">
        <aside className=" w-1/3 min-w-[200px] p-4 border-r-[1px] border-border/40 overflow-y-auto hidden lg:flex lg:flex-col">
          <div className="h-[200px] self-stretch">
            {banner && <BoatBannerView banner={banner} />}
          </div>
          <h3 className="text-2xl">{boat?.name}</h3>
          <p className="leading-none">{boat?.description}</p>
          <Separator className="my-4" />

        </aside>
        <div className="flex-1 ml-auto overflow-y-auto">
          <Navbar>
            <BoatPageHeader boat={boat} />
          </Navbar>
          <div className="flex flex-col items-center space-y-2 pt-2">
            <div className="flex items-center justify-center gap-2 w-full">
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
    </div>
  )

}