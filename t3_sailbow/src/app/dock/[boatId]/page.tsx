"use client";

import BannerModal from "@/app/_components/banner-modal";
import { useBoat } from "@/hooks/use-boat";
import { api } from "@/trpc/react";

export default function Page() {
  const { id, name, description, banner, dispatch } = useBoat();
  const { mutate: updateBanner } = api.dock.editBoatBanner.useMutation();
  return (
    <div className="h-full sm:container">
      <div className="flex size-full flex-col justify-between gap-2">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-xl leading-none tracking-tight sm:text-3xl">
            {name}
          </h1>

          {!banner && (
            <BannerModal
              onBannerChange={(newBanner) => {
                dispatch({
                  type: "update-banner",
                  payload: newBanner,
                });
                updateBanner({ boatId: id, banner: newBanner });
              }}
            />
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <p className="mt-2 max-w-xl leading-8">{description}</p>
      </div>
    </div>
  );
}
