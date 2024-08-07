"use client";

import BannerModal from "@/app/_components/banner-modal";
import { useBoat } from "@/hooks/use-boat";
import { api } from "@/trpc/react";
import {
  BoatPageContainer,
  BoatPageContent,
  BoatPageHeader,
  BoatPageTitle,
} from "../boat-page-components";
import HomePageContent from "./home-page-content";

export default function Page() {
  const { id, name, banner, dispatch } = useBoat();
  const { mutate: updateBanner } = api.dock.editBoatBanner.useMutation();
  return (
    <BoatPageContainer>
      <BoatPageHeader>
        <BoatPageTitle>{name}</BoatPageTitle>
        {!banner && (
          <div className="ml-auto">
            <BannerModal
              onBannerChange={(newBanner) => {
                dispatch({
                  type: "update-banner",
                  payload: newBanner,
                });
                updateBanner({ boatId: id, banner: newBanner });
              }}
            />
          </div>
        )}
      </BoatPageHeader>
      <BoatPageContent>
        <HomePageContent />
      </BoatPageContent>
    </BoatPageContainer>
  );
}
