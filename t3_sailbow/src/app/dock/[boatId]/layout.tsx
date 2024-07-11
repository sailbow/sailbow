import { BoatNav } from "./boat-nav";
import { TooltipProvider } from "@/components/ui/tooltip";
import BoatLayoutHeader from "./boat-layout-header";
import { api } from "@/trpc/server";
import { BoatContext } from "@/hooks/use-boat";
import NotFoundPage from "@/app/_components/not-found-page";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { boatId: number };
}) {
  const boat = await api.dock.getBoatById.query({ boatId: params.boatId });
  if (!boat) return <NotFoundPage />;
  return (
    <BoatContext initialBoat={boat}>
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
