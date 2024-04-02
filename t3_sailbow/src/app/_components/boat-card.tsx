// 'use client';
import { type Boat } from "@/lib/schemas/boat";
import {
    Card,
    CardContent,
    CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const BoatCard = ({ boat }: { boat: Boat }) => {
    let banner;
    if (boat.bannerType === "color") {
        banner = (
            <div style={{ backgroundColor: boat.bannerValue }} className="h-full w-full" />
        )
    } else {
        banner = (
            <Image
                fill
                alt={`${boat.name} banner image`}
                src={boat.bannerValue}
                objectFit="cover"
            />
        )
    }
    return (
        <Link href={`/dock/${boat.id}`}>
            <Card className="h-[200px] max-w-sm flex flex-col overflow-hidden transition hover:scale-105">
                <CardContent className="p-0 relative basis-3/4">
                    {banner}
                </CardContent>
                <div className="flex items-center basis-1/4">
                    <div className="flex items-center justify-center p-4">
                        <CardTitle className="text-lg font-semibold">
                            {boat.name}
                        </CardTitle>
                    </div>
                </div>
            </Card>
        </Link>
    )
}

export default BoatCard;