"use client";
import ImageWithLoader from "@/app/_components/image-with-loader";
import { useActiveTrip } from "@/lib/trip-queries";

export default function TripHeader() {
  const { data, isLoading } = useActiveTrip();

  if (isLoading || !data?.banner) return;

  return (
    <div className="relative mx-auto aspect-[16/5] w-full max-w-3xl px-8 pt-4">
      <ImageWithLoader src={data.banner.full} alt={data.banner.alt} />
    </div>
  );
}
