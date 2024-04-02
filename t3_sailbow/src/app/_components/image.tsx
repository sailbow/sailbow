"use client"

import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image"
import { useState } from "react";

interface ImageWithLoaderProps {
    src: string;
    alt: string;
}
export default function ImageWithLoader(props: ImageWithLoaderProps) {
    const [isLoaded, setIsLoaded] = useState(false)
    return (
        <div className="relative size-full overflow-hidden">
            <Image
                fill
                alt={props.alt}
                src={props.src}
                objectFit="cover"
                className="rounded-lg object-cover"
                onLoadingComplete={() => setIsLoaded(true)}
            />
            {!isLoaded && (
                <Skeleton className="size-full" />
            )}
        </div>
    )
}