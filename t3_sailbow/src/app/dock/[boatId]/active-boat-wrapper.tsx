"use client";

import CenteredSpinner from "@/app/_components/centered-spinner";
import NotFoundPage from "@/app/_components/not-found-page";
import { useGlobalActiveBoat } from "@/hooks/use-boat";

export default function ActiveBoatWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { activeBoat, isLoading } = useGlobalActiveBoat();

  if (isLoading) {
    console.log("ActiveBoatWrapper: rendering CenteredSpinner");
    return <CenteredSpinner />;
  }
  if (!activeBoat) {
    console.log("ActiveBoatWrapper: rendering NotFoundPage");
    return <NotFoundPage />;
  }
  console.log("ActiveBoatWrapper: rendering children");
  return children;
}
