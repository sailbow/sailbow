"use client";

import CenteredSpinner from "@/app/_components/centered-spinner";
import NotFoundPage from "@/app/_components/not-found-page";
import { useActiveTrip } from "@/lib/trip-queries";

export default function NotFoundWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: trip, isLoading } = useActiveTrip();
  if (isLoading) return <CenteredSpinner />;
  if (!trip) {
    return <NotFoundPage />;
  }
  return children;
}
