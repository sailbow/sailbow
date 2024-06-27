import { api } from "@/trpc/server";
import { type BoatTab } from "./tabs";
import { bannerSchema } from "@/lib/schemas/boat";
import BoatBannerView from "@/app/_components/boat-banner-view";
import NotFoundPage from "@/app/_components/not-found-page";
import { BoatNav } from "./boat-nav";
import { TooltipProvider } from "@/components/ui/tooltip";
import { type ActiveBoat, ActiveBoatContext } from "@/hooks/use-boat";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    boatId: number;
    tab: BoatTab | null | undefined;
  };
}) {
  const boat: ActiveBoat | null = await api.dock.getBoatById.query({
    boatId: params.boatId,
  });

  if (!boat) {
    return <NotFoundPage />;
  }

  return (
    <div className="relative flex size-full flex-col justify-end">
      <div className="sticky h-40 w-full">
        <BoatBannerView banner={bannerSchema.nullish().parse(boat)} />
      </div>
      <div className="w-full flex-1 overflow-hidden">
        <TooltipProvider delayDuration={0}>
          <div className="mx-auto flex size-full flex-col justify-items-end sm:flex-row sm:gap-4">
            <BoatNav boatId={params.boatId} />
            <div className="relative grow overflow-hidden">{children}</div>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}
