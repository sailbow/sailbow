// 'use client';
import { type Boat } from "@/lib/schemas/boat";
import {
    Card,
    CardContent,
    CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import ImageWithLoader from "./image-with-loader";

const BoatCard = ({ boat }: { boat: Boat }) => {
    let banner;
    if (boat.bannerType === "color") {
        banner = (
            <div style={{ backgroundColor: boat.bannerValue }} className="h-full w-full" />
        )
    } else {
        banner = (
            <ImageWithLoader src={boat.bannerValue} alt={boat.name + " image"} className="rounded-b-none" />
        )
    }
    return (
        <Link href={`/dock/${boat.id}`}>
            <Card className="h-[250px] flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:transform hover:scale-105 hover:border-2 hover:border-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent focus:scale-105 focus:transform">
                <CardContent className="p-0 relative basis-3/4">
                    {banner}
                </CardContent>
                <div className="flex items-center basis-1/4">
                    <div className="flex items-center justify-center p-4">
                        <CardTitle className="text-lg font-normal">
                            {boat.name}
                        </CardTitle>
                    </div>
                </div>
            </Card>
        </Link>
    )
}

export default BoatCard;