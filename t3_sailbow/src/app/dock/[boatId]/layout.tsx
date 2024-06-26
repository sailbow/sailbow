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
    <div className="size-full">
      <div className="top-0 h-40 w-full">
        <BoatBannerView banner={bannerSchema.nullish().parse(boat)} />
      </div>
      <div className="h-[calc(theme(spacing.main-height) - 1rem)] flex flex-col gap-4 overflow-y-auto p-2 sm:flex-row sm:p-4">
        <TooltipProvider delayDuration={0}>
          <BoatNav boatId={params.boatId} />
          <div className="grow">{children}</div>
        </TooltipProvider>
      </div>
    </div>
  );
}
