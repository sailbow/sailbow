import { type BoatBanner } from "@/lib/schemas/boat";
import ImageWithLoader from "./image-with-loader";
import { Skeleton } from "@/components/ui/skeleton";

export default function BoatBannerView({
  banner,
}: {
  banner: BoatBanner | null | undefined;
}) {
  if (!banner) {
    return (
      <div className="relative size-full overflow-hidden">
        <Skeleton className="size-full rounded-none bg-slate-300" />
      </div>
    );
  }
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
