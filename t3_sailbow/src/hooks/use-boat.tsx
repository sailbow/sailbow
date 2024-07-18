"use client";
import { type CrewMember } from "@/lib/common-types";
import { type Boat } from "@/lib/schemas/boat";
import { type BoatBanner } from "@/server/db/schema";
import { type api } from "@convex/_generated/api";
import { type Id, type Doc } from "convex/_generated/dataModel";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { type FunctionReturnType } from "convex/server";
import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ActiveBoat = FunctionReturnType<
  typeof api.trips.queries.getTripById
>;

type ActiveBoatContextProps = {
  children: React.ReactNode;
};

interface BoatContext extends ActiveBoat {
  dispatch: React.Dispatch<BoatActions>;
}

interface GlobalActiveBoatContext {
  boat: ActiveBoat | null;
  setBoat: (boat: ActiveBoat | null) => void;
}

const initialState: BoatContext = {
  _id: "" as Id<"trips">,
  name: "",
  slug: "",
  description: "",
  banner: null,
  _creationTime: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {},
};
const boatContext = createContext<BoatContext>(initialState);

const globalActiveBoatContext = createContext<GlobalActiveBoatContext>({
  boat: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setBoat: () => {},
});

type SetActiveBoat = {
  type: "set-active-boat";
  payload: ActiveBoat | null | undefined;
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

const boatReducer = (state: ActiveBoat, action: BoatActions): ActiveBoat => {
  switch (action.type) {
    case "update-banner":
      return {
        ...state,
        banner: action.payload,
      } as Doc<"trips">;
    case "add-crew-member":
      return {
        ...state,
        // crew: state.crew ? [action.payload],
      };
    case "update-description":
      return {
        ...state,
        description: action.payload,
      };
    default:
      return state;
  }
};

export const BoatContext = ({
  children,
  initialBoat,
}: {
  children: React.ReactNode;
  initialBoat: Preloaded<typeof api.trips.queries.getTripById>;
}) => {
  const initial = usePreloadedQuery(initialBoat);
  const [state, dispatch] = useReducer(boatReducer, initial);
  const value = useMemo(() => {
    return {
      ...state,
      dispatch,
    };
  }, [state, dispatch]);

  const { setBoat } = useGlobalActiveBoat();

  useEffect(() => {
    setBoat(value);
  }, [setBoat, value]);

  return <boatContext.Provider value={value}>{children}</boatContext.Provider>;
};

export const GlobalActiveBoatContext = ({
  children,
}: ActiveBoatContextProps) => {
  const [boat, setBoat] = useState<ActiveBoat | null>(null);
  useEffect(() => {
    console.log(boat);
  }, [boat]);
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
