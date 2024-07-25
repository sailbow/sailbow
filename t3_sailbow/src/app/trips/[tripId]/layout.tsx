import { TripNav } from "./trip-nav";
import { TooltipProvider } from "@/components/ui/tooltip";
import TripHeader from "./trip-header";
import { api } from "@convex/_generated/api";
import { preloadProtectedQuery } from "@/lib/convex-server-helpers";
import { notFound } from "next/navigation";
import { TripContext } from "@/lib/use-trip";
import { type Id } from "@convex/_generated/dataModel";
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { tripId: Id<"trips"> };
}) {
  const trip = await preloadProtectedQuery(api.trips.queries.getById, params);
  if (!trip) {
    return notFound();
  }
  return (
    <TripContext initialTrip={trip}>
      <div className="relative flex size-full flex-col justify-end">
        <TripHeader />
        <div className="w-full flex-1 overflow-hidden p-4">
          <TooltipProvider delayDuration={0}>
            <div className="flex size-full gap-4">
              <TripNav />
              <div className="relative max-w-5xl grow">{children}</div>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </TripContext>
  );
}
