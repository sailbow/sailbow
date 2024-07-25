"use client";
import NotFoundPage from "@/app/_components/not-found-page";
import { type api } from "@convex/_generated/api";
import { type Id } from "convex/_generated/dataModel";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { type FunctionReturnType } from "convex/server";
import React, { createContext, useContext, useEffect, useState } from "react";

export type ActiveTrip = FunctionReturnType<typeof api.trips.queries.getById>;

type ActiveBoatContextProps = {
  children: React.ReactNode;
};

interface GlobalActiveTripContext {
  trip: ActiveTrip | null;
  setTrip: (trip: ActiveTrip | null) => void;
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

const globalActiveBoatContext = createContext<GlobalActiveTripContext>({
  trip: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setTrip: () => {},
});

export const TripContext = ({
  children,
  initialTrip,
}: {
  children: React.ReactNode;
  initialTrip: Preloaded<typeof api.trips.queries.getById>;
}) => {
  const trip = usePreloadedQuery(initialTrip);

  const { setTrip } = useGlobalActiveTrip();

  useEffect(() => {
    setTrip(trip);
  }, [trip, setTrip]);

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
    <globalActiveBoatContext.Provider value={{ trip: boat, setTrip: setBoat }}>
      {children}
    </globalActiveBoatContext.Provider>
  );
};

export const useTrip = () => {
  const ctx = useContext(boatContext);
  if (!ctx) {
    throw new Error("No active trip");
  }
  return ctx;
};
export const useGlobalActiveTrip = () => {
  return useContext(globalActiveBoatContext);
};
