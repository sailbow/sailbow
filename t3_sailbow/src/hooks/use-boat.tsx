"use client";
import { type CrewMember } from "@/lib/common-types";
import { type Boat } from "@/lib/schemas/boat";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type ActiveBoat = Boat & {
  crew: CrewMember[];
  captain?: CrewMember | undefined;
};

type ActiveBoatContextProps = {
  children: React.ReactNode;
};

interface ActiveBoatContext {
  activeBoat: ActiveBoat | null | undefined;
  isLoading: boolean;
}

const activeBoatContext = createContext<ActiveBoatContext>({
  activeBoat: undefined,
  isLoading: false,
});

export const ActiveBoatContext = ({ children }: ActiveBoatContextProps) => {
  const params = useParams();
  const [boatId, setBoatId] = useState(-1);
  const { isLoading, data: activeBoat } = api.dock.getBoatById.useQuery(
    { boatId },
    { enabled: boatId > 0 },
  );
  useEffect(() => {
    if (params.boatId) {
      setBoatId(parseInt(params.boatId as string));
    }
  }, [params]);
  return (
    <activeBoatContext.Provider value={{ isLoading, activeBoat }}>
      {children}
    </activeBoatContext.Provider>
  );
};

export const useActiveBoat = () => {
  return useContext(activeBoatContext);
};
