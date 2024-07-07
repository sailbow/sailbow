"use client";
import BannerModal from "@/app/_components/banner-modal";
import ImageWithLoader from "@/app/_components/image-with-loader";
import { useBoat } from "@/hooks/use-boat";
import { type BoatBanner } from "@/lib/schemas/boat";

export default function BoatLayoutHeader() {
  const { banner, dispatch } = useBoat();
  const updateBanner = (banner: BoatBanner) => {
    dispatch({
      type: "update-banner",
      payload: banner,
    });
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
        <BannerModal banner={banner} onBannerChange={updateBanner} />
      </div>
    </div>
  );
}
