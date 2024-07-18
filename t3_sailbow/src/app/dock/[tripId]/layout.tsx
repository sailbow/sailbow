import { BoatNav } from "./boat-nav";
import { TooltipProvider } from "@/components/ui/tooltip";
import BoatLayoutHeader from "./boat-layout-header";
// import { api } from "@/trpc/server";
import { TripContext } from "@/hooks/use-boat";
import { api } from "@convex/_generated/api";
import { preloadProtectedQuery } from "@/lib/convex-server-helpers";
import { notFound } from "next/navigation";
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { tripId: string };
}) {
  const trip = await preloadProtectedQuery(
    api.trips.queries.getTripById,
    params,
  );
  if (!trip) {
    return notFound();
  }
  return (
    <TripContext initialTrip={trip}>
      <div className="relative flex size-full flex-col justify-end">
        <BoatLayoutHeader />
        <div className="w-full flex-1 overflow-hidden p-4">
          <TooltipProvider delayDuration={0}>
            <div className="flex size-full flex-col justify-items-end gap-2 sm:flex-row sm:gap-4">
              <BoatNav />
              <div className="relative max-w-5xl grow">{children}</div>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </TripContext>
  );
}
