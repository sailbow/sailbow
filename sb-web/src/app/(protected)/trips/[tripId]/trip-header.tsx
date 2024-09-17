"use client";
import ImageWithLoader from "@/app/_components/image-with-loader";
import { useActiveTrip } from "@/lib/trip-queries";

export default function TripHeader() {
  const { data, isLoading } = useActiveTrip();

  if (isLoading || !data?.banner) return;

  return (
    <div className="relative h-40 w-full">
      <ImageWithLoader
        className="rounded-none"
        src={data.banner.full}
        alt={data.banner.alt}
      />
    </div>
  );
}
