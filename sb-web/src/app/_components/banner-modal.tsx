"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileSearch, ImageIcon, ImagePlus, PencilLine } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import ImageWithLoader from "./image-with-loader";
import useDebounce from "@/lib/use-debounce";
import CenteredSpinner from "./centered-spinner";
import { api } from "@convex/_generated/api";
import { useAction } from "convex/react";
import { type Doc } from "@convex/_generated/dataModel";
import { useDisclosure } from "@/lib/use-disclosure";
import { cn } from "@/lib/utils";

interface BannerModalProps {
  variant?: "add" | "edit" | "editIcon" | undefined;
  onBannerChange: (banner: Doc<"trips">["banner"] | null) => void;
}

type ImageData = {
  id: string;
  width: number;
  height: number;
  alt_description: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
};

export default function BannerModal(props: BannerModalProps) {
  const variant = props.variant ?? "add";
  const [query, setQuery] = useState("");
  const searchText = useDebounce(query, 500);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const searchAction = useAction(api.images.actions.search);
  const [data, setData] = useState<ImageData[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const search = useCallback(async () => {
    setIsLoading(true);
    setData(undefined);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const res: ImageData[] = await searchAction({ query: searchText, page: 1 });
    setData(res);
    setIsLoading(false);
  }, [searchAction, searchText]);

  const disclosure = useDisclosure();

  useEffect(() => {
    if (!!searchText) {
      void search();
    }
  }, [searchText, search]);

  const trigger = (() => {
    switch (variant) {
      case "add":
        return (
          <Button size="sm">
            <ImagePlus className="size-5" />
            Add a cover image
          </Button>
        );
      case "edit":
        return (
          <Button variant="outline" size="sm">
            <ImageIcon className="size-5" />
            Edit cover image
          </Button>
        );
      case "editIcon":
        return (
          <Button variant="secondary" size="icon">
            <PencilLine className="size-5" />
          </Button>
        );
    }
  })();

  return (
    <Dialog {...disclosure}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl px-3 pt-2 sm:px-6">
        <div className="flex h-[500px] w-full flex-col">
          <div className="text-xs italic text-muted-foreground">
            powered by{" "}
            <Button variant="link" className="p-0" asChild>
              <a href="https://unsplash.com" target="_blank">
                Unsplash
              </a>
            </Button>
          </div>
          <div className="sticky top-0 z-10 flex w-full items-center justify-between space-x-4">
            <div className="flex flex-1 flex-col">
              <Input
                type="search"
                className={cn("flex-1", !query && "font-light")}
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <DialogTitle className="sr-only">Search for an image</DialogTitle>
            </div>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="max-w-[80px] text-wrap text-xs sm:max-w-none sm:text-sm"
                onClick={() => props.onBannerChange(null)}
              >
                Remove image
              </Button>
            </DialogClose>
          </div>
          <div className="mt-4 flex-1 overflow-y-auto rounded-md">
            {isLoading ? (
              <CenteredSpinner />
            ) : !searchText ? (
              <div className="inline-flex w-full items-center justify-center pt-4">
                <FileSearch
                  className="mr-2 size-32 stroke-gray-300"
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
                      disclosure.setClosed();
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
