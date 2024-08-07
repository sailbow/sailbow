"use client";
import BannerModal from "@/app/_components/banner-modal";
import ImageWithLoader from "@/app/_components/image-with-loader";
import { useUpdateBanner } from "@/lib/trip-mutations";
import { toast } from "@/components/ui/toast";
import { useTrip } from "@/lib/trip-queries";

export default function TripHeader() {
  const { data, isLoading } = useTrip();
  const { mutate } = useUpdateBanner({
    onSuccess: (_, variables) => {
      toast.success(
        `Cover photo has been ${!!variables.banner ? "updated" : "removed"}!`,
      );
    },
  });

  if (isLoading || !data?.banner) return;

  return (
    <div className="relative h-40 w-full">
      <ImageWithLoader
        className="rounded-none"
        src={data.banner.full}
        alt={data.banner.alt}
      />
      <div className="absolute inset-x-2 bottom-2 z-10">
        <BannerModal
          variant="editIcon"
          onBannerChange={(b) => mutate({ tripId: data._id, banner: b })}
        />
      </div>
    </div>
  );
}
