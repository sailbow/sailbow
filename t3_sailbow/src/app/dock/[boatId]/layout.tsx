"use client";
import { useActiveBoat } from "@/hooks/use-boat";
import { api } from "@/trpc/react";
import { useEffect } from "react";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    boatId: number;
  };
}) {
  const { data: boat, error } = api.dock.getBoatById.useQuery({
    boatId: params.boatId,
  });
  const { setActiveBoat, setError } = useActiveBoat();

  // Reset active boat on mount
  useEffect(() => {
    if (setActiveBoat) setActiveBoat(null);
  }, [setActiveBoat]);

  useEffect(() => {
    if (boat && setActiveBoat) {
      setActiveBoat(boat);
    }
  }, [boat, setActiveBoat]);

  useEffect(() => {
    if (error) {
      console.error(error);
      if (setError) {
        setError(error.message);
      }
    }
  }, [error, setError]);

  return <>{children}</>;
}
