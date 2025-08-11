"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  className?: string | undefined;
}
export default function ImageWithLoader(props: ImageWithLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(false);
  }, [props.src, props.alt]);
  return (
    <div
      className={cn(
        "relative size-full overflow-hidden rounded-md",
        props.className,
      )}
    >
      <Image
        fill
        alt={props.alt}
        src={props.src}
        className={cn("object-cover", props.className)}
        data-loaded={isLoaded}
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && (
        <Skeleton
          data-loaded={isLoaded}
          className={cn("size-full", props.className)}
        />
      )}
    </div>
  );
}
