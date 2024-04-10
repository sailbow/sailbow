"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Image from "next/image"
import { useState } from "react";

interface ImageWithLoaderProps {
    src: string;
    alt: string;
    className?: string | undefined;
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
                className={cn("object-cover rounded-md", props.className)}
                onLoadingComplete={() => setIsLoaded(true)}
            />
            {!isLoaded && (
                <Skeleton className="size-full bg-slate-300" />
            )}
        </div>
    )
}