import Image from "next/image"
import { type BoatBanner } from "@/lib/schemas/boat"
import ImageWithLoader from "./image"

export default function BoatBannerView({ banner }: { banner: BoatBanner }) {
    if (banner.bannerType === "color") {
        return (
            <div style={{ backgroundColor: banner.bannerValue }} className="h-full w-full rounded-md" />
        )
    }

    return (
        <ImageWithLoader src={banner.bannerValue} alt="banner image" />
    )
}