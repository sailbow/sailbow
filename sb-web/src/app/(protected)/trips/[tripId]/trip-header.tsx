"use client";
import ImageWithLoader from "@/app/_components/image-with-loader";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useActiveTrip } from "@/lib/trip-queries";

export default function TripHeader() {
  const { data, isLoading } = useActiveTrip();

  if (isLoading || !data?.banner) return;

  return (
    <div className="container relative z-[50] mx-auto mb-4 aspect-[21/5] px-10">
      <ImageWithLoader src={data.banner.full} alt={data.banner.alt} />
    </div>
  );
}
