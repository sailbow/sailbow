import { type BoatBanner } from "@/lib/schemas/boat";
import ImageWithLoader from "./image-with-loader";

export default function BoatBannerView({ banner }: { banner: BoatBanner }) {
  if (banner.bannerType === "color") {
    return (
      <div
        style={{ backgroundColor: banner.bannerValue }}
        className="h-full w-full"
      />
    );
  }

  return (
    <div className="size-full">
      <ImageWithLoader src={banner.bannerValue} alt="banner image" />
    </div>
  );
}
