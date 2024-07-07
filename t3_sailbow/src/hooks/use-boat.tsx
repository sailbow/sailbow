"use client";
import { type CrewMember } from "@/lib/common-types";
import { type Boat } from "@/lib/schemas/boat";
import { type BoatBanner } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ActiveBoat = Boat & {
  crew: CrewMember[];
  captain?: CrewMember | undefined;
};

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
  id: -1,
  name: "",
  slug: "",
  description: "",
  banner: null,
  captainUserId: "",
  crew: [],
  createdOn: new Date(1970, 1),
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

type BoatActions =
  | SetActiveBoat
  | UpdateIsLoading
  | UpdateBanner
  | AddCrewMember;

const boatReducer = (state: ActiveBoat, action: BoatActions): ActiveBoat => {
  switch (action.type) {
    case "update-banner":
      return {
        ...state,
        banner: action.payload,
      };
    case "add-crew-member":
      return {
        ...state,
        crew: [...state.crew, action.payload],
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
  initialBoat: ActiveBoat;
}) => {
  const [state, dispatch] = useReducer(boatReducer, initialBoat);
  const value = useMemo(() => {
    return {
      ...state,
      dispatch,
    };
  }, [state, dispatch]);

  const { setBoat } = useGlobalActiveBoat();

  useEffect(() => {
    console.log("setting global boat", value);
    setBoat(value);
  }, [setBoat, value]);

  return <boatContext.Provider value={value}>{children}</boatContext.Provider>;
};

export const GlobalActiveBoatContext = ({
  children,
}: ActiveBoatContextProps) => {
  const [boat, setBoat] = useState<ActiveBoat | null>(null);
  // const value = useMemo(() => {
  //   return {
  //     boat,
  //     setBoat,
  //   };
  // }, [boat, setBoat]);
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
