"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { PencilLine } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Spinner } from "./spinner";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { type BoatBanner } from "@/lib/schemas/boat";
import ImageWithLoader from "./image-with-loader";
import { toast } from "@/components/ui/toast";
import useDebounce from "@/lib/use-debounce";
import Link from "next/link";
import CenteredSpinner from "./centered-spinner";

interface BannerModalProps {
  initialBanner?: BoatBanner | undefined;
  onBannerChange: (banner: BoatBanner) => void;
}

export default function BannerModal(props: BannerModalProps) {
  const [query, setQuery] = useState("");
  const searchText = useDebounce(query, 250);
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="absolute inset-x-2 bottom-2"
        >
          <PencilLine className="size-full" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <div className="relative flex h-[500px] w-full flex-col gap-2">
          <div className="sticky top-0 z-10 flex w-full flex-row items-center gap-2 space-y-0 bg-background p-2">
            <DialogTitle className="sr-only">Search for an image</DialogTitle>
            <Input
              className="flex-1"
              placeholder="Search for an image..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="ml-auto text-xs italic text-muted-foreground">
              powered by{" "}
              <Button variant="link" className="p-0" asChild>
                <a href="https://unsplash.com">Unsplash</a>
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isFetching && <CenteredSpinner />}
            <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
              {data?.map((v, i) => (
                <div
                  key={i}
                  className="relative h-40 w-full cursor-pointer overflow-hidden"
                  onClick={() => {
                    props.onBannerChange({
                      bannerType: "url",
                      bannerValue: v.urls.regular,
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
