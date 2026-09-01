"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Image from "@/components/ui/image";
import { useState } from "react";

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  className?: string | undefined;
}

function ImageContent({ src, alt, className }: ImageWithLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={cn(
        "relative size-full overflow-hidden rounded-md",
        className,
      )}
    >
      <Image
        fill
        alt={alt}
        src={src}
        className={cn("object-cover", className)}
        data-loaded={isLoaded}
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && (
        <Skeleton
          data-loaded={isLoaded}
          className={cn("size-full", className)}
        />
      )}
    </div>
  );
}

export default function ImageWithLoader(props: ImageWithLoaderProps) {
  return <ImageContent key={`${props.src}-${props.alt}`} {...props} />;
}
