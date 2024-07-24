"use client";
import NotFoundPage from "@/app/_components/not-found-page";
import { type CrewMember } from "@/lib/common-types";
import { type Boat } from "@/lib/schemas/boat";
import { type BoatBanner } from "@/server/db/schema";
import { type api } from "@convex/_generated/api";
import { type Id, type Doc } from "convex/_generated/dataModel";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { type FunctionReturnType } from "convex/server";
import React, { createContext, useContext, useEffect, useState } from "react";

export type ActiveTrip = FunctionReturnType<typeof api.trips.queries.getById>;

type ActiveBoatContextProps = {
  children: React.ReactNode;
};

interface GlobalActiveBoatContext {
  boat: ActiveTrip | null;
  setBoat: (boat: ActiveTrip | null) => void;
}

const initialState: ActiveTrip = {
  _id: "" as Id<"trips">,
  name: "",
  slug: "",
  description: "",
  banner: null,
  _creationTime: 0,
};
const boatContext = createContext<ActiveTrip>(initialState);

const globalActiveBoatContext = createContext<GlobalActiveBoatContext>({
  boat: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setBoat: () => {},
});

type SetActiveBoat = {
  type: "set-active-boat";
  payload: ActiveTrip | null | undefined;
};
type UpdateIsLoading = { type: "update-is-loading"; payload: boolean };
type UpdateBanner = { type: "update-banner"; payload: BoatBanner | null };
type AddCrewMember = { type: "add-crew-member"; payload: CrewMember };
type UpdateDescription = { type: "update-description"; payload: string };

type BoatActions =
  | SetActiveBoat
  | UpdateIsLoading
  | UpdateBanner
  | AddCrewMember
  | UpdateDescription;

export const TripContext = ({
  children,
  initialTrip,
}: {
  children: React.ReactNode;
  initialTrip: Preloaded<typeof api.trips.queries.getById>;
}) => {
  const trip = usePreloadedQuery(initialTrip);

  const { setBoat } = useGlobalActiveBoat();

  useEffect(() => {
    setBoat(trip);
  }, [trip, setBoat]);

  return (
    <boatContext.Provider value={trip}>
      {!trip ? <NotFoundPage /> : children}
    </boatContext.Provider>
  );
};

export const GlobalActiveTripContext = ({
  children,
}: ActiveBoatContextProps) => {
  const [boat, setBoat] = useState<ActiveTrip | null>(null);
  return (
    <globalActiveBoatContext.Provider value={{ boat, setBoat }}>
      {children}
    </globalActiveBoatContext.Provider>
  );
};

export const useBoat = () => {
  const ctx = useContext(boatContext);
  if (!ctx) {
    throw new Error("No active boat");
  }
  return ctx;
};
export const useGlobalActiveBoat = () => {
  return useContext(globalActiveBoatContext);
};
