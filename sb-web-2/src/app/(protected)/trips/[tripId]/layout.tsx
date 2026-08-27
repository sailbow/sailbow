import TripHeader from "./_components/trip-header";
import NotFoundWrapper from "./_components/not-found-wrapper";
import { TripChatSidebarTrigger } from "./_components/trip-sidebar-trigger";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <NotFoundWrapper>
      <div className="static flex size-full flex-col">
        <TripHeader />
        <div className="relative top-0 flex-grow"><Outlet /></div>
        <TripChatSidebarTrigger />
      </div>
    </NotFoundWrapper>
  );
}
