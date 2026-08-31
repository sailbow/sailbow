import { useLoadScript } from "@react-google-maps/api";
import { useQuery } from "@tanstack/react-query";
import { getDetails } from "use-places-autocomplete";
import { env } from "@/env";

export const useGooglePlace = (placeId: string | null | undefined) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  return useQuery({
    queryKey: ["google-places", placeId],
    queryFn: async () => {
      const value = await getDetails({
        placeId: placeId ?? "",
      });
      if (typeof value !== "object")
        throw new Error("Cannot parse google places search result");

      return value;
    },
    staleTime: 1440 * 60 * 1000,
    enabled: Boolean(placeId && isLoaded),
  });
};
