"use client";
import BannerModal from "@/app/_components/banner-modal";
import { toast } from "@/components/ui/toast";
import { useUpdateBanner } from "@/lib/trip-mutations";
import { useActiveTripId } from "@/lib/trip-queries";

export default function TripBannerModal() {
  const { mutate: updateBanner } = useUpdateBanner({
    onSuccess: (_, variables) => {
      toast.success(
        `Cover photo ${!!variables.banner ? "updated" : "removed"} successfully!`,
      );
    },
  });
  const tripId = useActiveTripId();
  return (
    <BannerModal
      onBannerChange={(banner) => updateBanner({ tripId, banner })}
    />
  );
}