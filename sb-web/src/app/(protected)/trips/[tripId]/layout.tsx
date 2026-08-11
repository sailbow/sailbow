"use client";
import TripHeader from "./_components/trip-header";
import NotFoundWrapper from "./_components/not-found-wrapper";
import { TripChatSidebarTrigger } from "./_components/trip-sidebar-trigger";
import { GlassNavRail } from "./_components/nav-rail";
import {
  BudgetTile,
  CaptainTile,
  CrewTile,
  DatesTile,
  LocationTile,
} from "./(home)/components";
import TripDetails from "./(home)/trip-details";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PanelRightClose, SidebarClose, SidebarOpen } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [overviewOpen, setOverviewOpen] = useState(true);

  return (
    <NotFoundWrapper>
      <div className="flex h-[100vh] max-h-[100vh] w-[100vw] flex-col overflow-hidden">
        <TripHeader />
        <div className="group relative flex flex-grow overflow-hidden">
          {!overviewOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-2 z-[60] size-10 border border-border backdrop-blur"
              onClick={() => setOverviewOpen(true)}
              aria-label="Open overview"
            >
              <SidebarOpen />
            </Button>
          )}
          <OverviewSidebar open={overviewOpen} onOpenChange={setOverviewOpen} />
          <div
            className={`flex-1 overflow-auto transition-[margin-left] duration-200 ${
              overviewOpen ? "ml-80" : "ml-0"
            }`}
          >
            {children}
          </div>
        </div>

        <TripChatSidebarTrigger />
        <div className="absolute right-0 top-[25%] z-50 flex h-fit items-center p-4">
          <GlassNavRail />
        </div>
      </div>
    </NotFoundWrapper>
  );
}

const OverviewSidebar = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <aside
      className={`absolute left-0 top-0 z-40 h-full w-80 bg-background/95 shadow-lg transition-transform duration-200 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-label="Trip overview"
    >
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">Overview</h2>
        <Button
          variant="ghost"
          size="icon"
          className="size-10"
          onClick={() => onOpenChange(false)}
          aria-label="Close overview"
        >
          <SidebarClose />
        </Button>
      </div>
      <div className="flex h-[calc(100%-4rem)] flex-col gap-4 overflow-y-auto p-4">
        <CaptainTile />
        <CrewTile />
        <DatesTile />
        <LocationTile />
        <BudgetTile />
        <TripDetails />
      </div>
    </aside>
  );
};
