import { TooltipProvider } from "@/components/ui/tooltip";
import TripHeader from "./trip-header";
import NotFoundWrapper from "./not-found-wrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NotFoundWrapper>
      <div className="relative flex size-full flex-col">
        <TripHeader />
        <div className="relative top-0 flex-grow">{children}</div>
      </div>
    </NotFoundWrapper>
  );
}
