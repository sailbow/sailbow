import { Navigate, Route, Routes } from "react-router";
import Home from "./app/(public)/page";
import TripsPage from "./app/(protected)/trips/page";
import TripsLayout from "./app/(protected)/trips/layout";
import TripLayout from "./app/(protected)/trips/[tripId]/layout";
import TripHomePage from "./app/(protected)/trips/[tripId]/(home)/page";
import ItineraryPage from "./app/(protected)/trips/[tripId]/itinerary/page";
import AnnouncementsPage from "./app/(protected)/trips/[tripId]/announcements/page";
import CrewPage from "./app/(protected)/trips/[tripId]/crew/page";
import SettingsPage from "./app/(protected)/trips/[tripId]/settings/page";
import SignInPage from "./app/(public)/(auth)/sign-in/[[...sign-in]]/page";
import SignUpPage from "./app/(public)/(auth)/sign-up/[[...sign-up]]/page";
import AcceptInvitePage from "./app/(protected)/accept-invite/[inviteId]/page";
import NotFound from "./app/not-found";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route element={<TripsLayout />}>
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/trips/:tripId" element={<TripLayout />}>
          <Route index element={<TripHomePage />} />
          <Route path="itinerary" element={<ItineraryPage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="crew" element={<CrewPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="/accept-invite/:inviteId" element={<AcceptInvitePage />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}