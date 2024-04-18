"use client";
import { type CrewMember } from "@/lib/common-types";
import { type Boat } from "@/lib/schemas/boat";
import { TRPCError } from "@trpc/server";
import { createContext, useContext, useState } from "react";

export type ActiveBoat = Boat & {
  crew: CrewMember[];
  captain?: CrewMember | undefined;
};

export type ActiveBoatError = {
  message: string;
  code: TRPCError["code"];
};

interface ActiveBoatContext {
  activeBoat: ActiveBoat | null;
  setActiveBoat: (boat: ActiveBoat | null) => void;
  error: ActiveBoatError | null;
  setError: (error: ActiveBoatError) => void;
}

const activeBoatContext = createContext<ActiveBoatContext | null>(null);

export const ActiveBoatContext = (props: { children: React.ReactNode }) => {
  const [activeBoat, setActiveBoat] = useState<ActiveBoat | null>(null);
  const [error, setError] = useState<ActiveBoatError | null>(null);
  return (
    <activeBoatContext.Provider
      value={{ activeBoat, setActiveBoat, error, setError }}
    >
      {props.children}
    </activeBoatContext.Provider>
  );
};

export const useActiveBoat = () => {
  const context = useContext(activeBoatContext);
  return {
    activeBoat: context?.activeBoat,
    setActiveBoat: context?.setActiveBoat,
    error: context?.error,
    setError: context?.setError,
  };
};
