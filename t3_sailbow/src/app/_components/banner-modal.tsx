"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileSearch, ImageIcon, ImagePlus, PencilLine } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { type BoatBanner } from "@/lib/schemas/boat";
import ImageWithLoader from "./image-with-loader";
import { toast } from "@/components/ui/toast";
import useDebounce from "@/lib/use-debounce";
import CenteredSpinner from "./centered-spinner";

interface BannerModalProps {
  variant?: "add" | "edit" | "editIcon" | undefined;
  onBannerChange: (banner: BoatBanner) => void;
}

export default function BannerModal(props: BannerModalProps) {
  const variant = props.variant ?? "add";
  const [query, setQuery] = useState("");
  const searchText = useDebounce(query, 500);
  const { data, isFetching, error } = api.images.search.useQuery(
    { query: searchText },
    {
      enabled: !!searchText && searchText !== "",
      keepPreviousData: false,
      meta: { errorMessage: "Failed to search images, please try again later" },
    },
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong, please try again later");
    }
  }, [error]);

  const trigger = (() => {
    switch (variant) {
      case "add":
        return (
          <Button variant="ghost" size="sm">
            <ImagePlus className="size-6 md:mr-2" />
            <span className="hidden md:inline-flex">Add a cover image</span>
          </Button>
        );
      case "edit":
        return (
          <Button variant="ghost" size="sm">
            <ImageIcon className="size-6 md:mr-2" />
            <span className="hidden md:inline-flex">Edit cover image</span>
          </Button>
        );
      case "editIcon":
        return (
          <Button variant="secondary" size="icon">
            <PencilLine className="size-6" />
          </Button>
        );
    }
  })();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl pt-2">
        <div className="flex h-[500px] w-full flex-col">
          <div className="text-xs italic text-muted-foreground">
            powered by{" "}
            <Button variant="link" className="p-0" asChild>
              <a href="https://unsplash.com" target="_blank">
                Unsplash
              </a>
            </Button>
          </div>
          <div className="sticky top-0 z-10 flex w-full items-center justify-between space-x-8 bg-background">
            <div className="flex flex-1 flex-col">
              <Input
                type="search"
                className="flex-1"
                placeholder="Search for an image..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <DialogTitle className="sr-only">Search for an image</DialogTitle>
            </div>
            <DialogClose asChild>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => props.onBannerChange(null)}
              >
                Remove image
              </Button>
            </DialogClose>
          </div>
          <div className="mt-4 flex-1 overflow-y-auto rounded-md">
            {isFetching ? (
              <CenteredSpinner />
            ) : !searchText ? (
              <div className="inline-flex w-full items-center justify-center pt-4">
                <FileSearch
                  className="mr-2 size-32 stroke-muted-foreground"
                  strokeWidth={1.5}
                />
              </div>
            ) : (
              <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                {data?.map((v, i) => (
                  <div
                    key={i}
                    className="relative h-40 w-full cursor-pointer overflow-hidden"
                    onClick={() => {
                      props.onBannerChange({
                        thumbnail: v.urls.thumb,
                        small: v.urls.small,
                        regular: v.urls.regular,
                        full: v.urls.full,
                        alt: v.alt_description,
                      });
                      setIsOpen(false);
                    }}
                  >
                    <ImageWithLoader
                      className="rounded-md"
                      src={v.urls.small}
                      alt={v.alt_description}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
