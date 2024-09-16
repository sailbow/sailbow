"use client";

import CenteredSpinner from "@/app/_components/centered-spinner";
import NotFoundPage from "@/app/_components/not-found-page";
import { useTrip } from "@/lib/trip-queries";

export default function NotFoundWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: trip, isLoading } = useTrip();
  if (isLoading) return <CenteredSpinner />;
  if (!trip) {
    return <NotFoundPage />;
  }
  return children;
}
