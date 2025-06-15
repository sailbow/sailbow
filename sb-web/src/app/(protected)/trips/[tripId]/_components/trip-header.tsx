"use client";
import ImageWithLoader from "@/app/_components/image-with-loader";
import { useActiveTrip } from "@/lib/trip-queries";

export default function TripHeader() {
  const { data, isLoading } = useActiveTrip();

  if (isLoading || !data?.banner) return;

  return (
    <div className="relative z-[50] aspect-[3/1] w-full lg:aspect-[21/3]">
      <ImageWithLoader
        src={data.banner.full}
        alt={data.banner.alt}
        className="rounded-none"
      />
    </div>
  );
}
