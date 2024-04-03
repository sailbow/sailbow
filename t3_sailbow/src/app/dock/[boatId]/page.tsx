import BoatBannerView from "@/app/_components/boat-banner-view";
import BoatPageHeader from "@/app/_components/boat-page-header";
import { Boat, BoatBanner, bannerSchema } from "@/lib/schemas/boat";
import { api } from "@/trpc/server";
import { Loader2 } from "lucide-react";

export default async function Page({ params }: { params: { boatId: number } }) {
  const boat: Boat = await api.dock.getBoatById.query(params)
  const banner: BoatBanner = bannerSchema.parse(boat)
  return (
    <div className="p-4">
      <BoatPageHeader boat={boat} />
      <div className="flex flex-col w-full mt-2">
        <div className="w-full h-[200px]">
          <BoatBannerView banner={banner} />
        </div>
        <h2 className="scroll-m-20 text-4xl tracking-tight lg:text-5xl mt-3">
          {boat.name}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {boat.description}
        </p>
      </div>
    </div>
  )
}