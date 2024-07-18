import { BoatNav } from "./boat-nav";
import { TooltipProvider } from "@/components/ui/tooltip";
import BoatLayoutHeader from "./boat-layout-header";
// import { api } from "@/trpc/server";
import { BoatContext } from "@/hooks/use-boat";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import NotFoundPage from "@/app/_components/not-found-page";
import CenteredSpinner from "@/app/_components/centered-spinner";
import ConvexAuthenticated from "../convex-authenticated";
import { preloadProtectedQuery } from "@/lib/convex-helpers";
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
    <BoatContext initialBoat={trip}>
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
    </BoatContext>
  );
}
