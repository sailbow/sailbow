"use client";

import NotFoundPage from "@/app/_components/not-found-page";
import { useTrip } from "@/lib/trip-queries";

export default function NotFoundWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: trip, isLoading } = useTrip();
  if (!isLoading && !trip) {
    return <NotFoundPage />;
  }
  return children;
}
