"use client";
import ImageWithLoader from "@/app/_components/image-with-loader";
import { useActiveTrip } from "@/lib/trip-queries";

export default function TripHeader() {
  const { data, isLoading } = useActiveTrip();

  if (isLoading || !data?.banner) return;

  return (
    <div className="container relative z-[50] mx-auto aspect-[3/1] pt-4 sm:aspect-[21/5]">
      <ImageWithLoader src={data.banner.full} alt={data.banner.alt} />
    </div>
  );
}
