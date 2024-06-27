"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
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

interface BannerModalProps {
  initialBanner?: BoatBanner | undefined;
  onBannerChange: (banner: BoatBanner) => void;
}

export default function BannerModal(props: BannerModalProps) {
  const [query, setQuery] = useState<string>("");
  const { data, isFetching, error, refetch } = api.images.search.useQuery(
    { query },
    {
      enabled: false,
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
      <DialogContent className="w-4/5 max-w-2xl rounded-lg">
        <Tabs defaultValue="image">
          <DialogHeader className="items-center">
            <TabsList className="mb-2 grid w-full max-w-lg grid-cols-1">
              {/* <TabsTrigger value="color">Color</TabsTrigger> */}
              <TabsTrigger value="image">Image</TabsTrigger>
            </TabsList>
          </DialogHeader>
          <div className="min-h-[300px] min-w-full overflow-y-auto p-2">
            {/* <TabsContent value="color">
                            <h3>Colors tab</h3>
                        </TabsContent> */}
            <TabsContent value="image" className="h-[500px] w-full">
              <div className="flex w-full flex-col items-center space-y-2">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="search"
                    placeholder="Search for an image..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <Button
                    type="button"
                    disabled={!query || isFetching}
                    onClick={() => refetch()}
                  >
                    Search
                  </Button>
                </div>
                <Spinner isVisible={isFetching} className="mt-2 size-8" />
                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                  {data?.map((v, i) => (
                    <div
                      key={i}
                      className="relative h-40 w-full cursor-pointer overflow-hidden"
                      onClick={() => {
                        props.onBannerChange({
                          bannerType: "url",
                          bannerValue: v.urls.raw,
                        });
                        setIsOpen(false);
                      }}
                    >
                      <ImageWithLoader
                        src={v.urls.small}
                        alt={v.alt_description}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
