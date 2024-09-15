"use client";
import BannerModal from "@/app/_components/banner-modal";
import { toast } from "@/components/ui/toast";
import { useUpdateBanner } from "@/lib/trip-mutations";
import { useTrip } from "@/lib/trip-queries";

export default function TripBannerModal() {
  const { mutate: updateBanner } = useUpdateBanner({
    onSuccess: (_, variables) => {
      toast.success(
        `Cover photo ${!!variables.banner ? "updated" : "removed"} successfully!`,
      );
    },
  });
  const { data: trip } = useTrip();
  if (!trip) return;
  return (
    <BannerModal
      onBannerChange={(banner) => updateBanner({ tripId: trip._id, banner })}
      variant={trip.banner ? "edit" : "add"}
    />
  );
}
