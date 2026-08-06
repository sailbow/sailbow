"use client";
import TripHeader from "./_components/trip-header";
import NotFoundWrapper from "./_components/not-found-wrapper";
import { TripChatSidebarTrigger } from "./_components/trip-sidebar-trigger";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileLayout from "./_components/mobile-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  if (isMobile)
    return (
      <NotFoundWrapper>
        <MobileLayout>{children}</MobileLayout>
      </NotFoundWrapper>
    );
  return (
    <NotFoundWrapper>
      <div className="static flex size-full flex-col">
        <TripHeader />
        <div className="relative top-0 flex-grow">{children}</div>
        <TripChatSidebarTrigger />
      </div>
    </NotFoundWrapper>
  );
}
