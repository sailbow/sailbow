"use client";
import BannerModal from "@/app/_components/banner-modal";
import ImageWithLoader from "@/app/_components/image-with-loader";
import { useBoat } from "@/hooks/use-boat";
import { type BoatBanner } from "@/lib/schemas/boat";
import { api } from "@/trpc/react";

export default function BoatLayoutHeader() {
  const { _id, banner, dispatch } = useBoat();
  const { mutate } = api.dock.editBoatBanner.useMutation({
    onMutate: (data) => {
      dispatch({
        type: "update-banner",
        payload: data.banner,
      });
    },
  });

  const updateBanner = (newBanner: BoatBanner) => {
    if (!banner && !newBanner) return;
    // mutate({ banner: newBanner, boatId: id });
  };

  if (!banner) return;
  return (
    <div className="relative h-40 w-full">
      <ImageWithLoader
        className="rounded-none"
        src={banner.full}
        alt={banner.alt}
      />
      <div className="absolute inset-x-2 bottom-2 z-10">
        <BannerModal variant="editIcon" onBannerChange={updateBanner} />
      </div>
    </div>
  );
}
