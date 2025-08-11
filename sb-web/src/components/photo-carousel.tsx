"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { type CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export default function PhotoCarouselDialog({
  photos,
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photos: Array<{ src: string; alt?: string; label?: string }>;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-hidden pt-8">
        <DialogTitle className="sr-only">Photo Gallery</DialogTitle>
        <DialogDescription className="sr-only">
          Browse through a collection of beautiful landscape photos
        </DialogDescription>

        <div className="relative overflow-hidden rounded-md">
          <Carousel className="w-full" setApi={setApi} opts={{ loop: true }}>
            <CarouselContent className="rounded-md">
              {photos.map((photo, ind) => (
                <CarouselItem key={ind}>
                  <Card className="border-0">
                    <CardContent className="p-0">
                      <div className="relative aspect-[4/3] w-full">
                        <Image
                          src={photo.src}
                          alt={photo.alt ?? ""}
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 size-10 opacity-80 backdrop-blur-xl" />
            <CarouselNext className="right-2 size-10 opacity-80 backdrop-blur-xl" />
          </Carousel>

          <div className="flex items-center justify-center gap-2 p-4">
            {photos.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "size-3 rounded-full bg-gray-300",
                  index === current && "bg-primary",
                )}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
