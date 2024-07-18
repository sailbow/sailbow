"use client";
import BannerModal from "@/app/_components/banner-modal";
import ImageWithLoader from "@/app/_components/image-with-loader";
import { useBoat } from "@/hooks/use-boat";
import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";

export default function BoatLayoutHeader() {
  const { _id, banner } = useBoat();
  const updateTripBanner = useMutation(api.trips.mutations.updateTripBanner);
  
  if (!banner) return;
  return (
    <div className="relative h-40 w-full">
      <ImageWithLoader
        className="rounded-none"
        src={banner.regular}
        alt={banner.alt}
      />
      <div className="absolute inset-x-2 bottom-2 z-10">
        <BannerModal variant="editIcon" onBannerChange={(b) => updateTripBanner({ tripId: _id, banner: b })} />
      </div>
    </div>
  );
}
