"use client";
import BannerModal from "@/app/_components/banner-modal";
import { useConvexQuery } from "@/lib/convex-client-helpers";
import { api } from "@convex/_generated/api";
import { type Id } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";

export default function TripBannerModal({ tripId }: { tripId: Id<"trips"> }) {
    const { isLoading, data: trip } = useConvexQuery(api.trips.queries.getTripById, { tripId } );
    const updateBanner = useMutation(api.trips.mutations.updateTripBanner);
    if (isLoading || trip === null) {
        return;
    }
    return (
        <BannerModal
            onBannerChange={(banner) => updateBanner({ tripId, banner })}
        />
    )
}