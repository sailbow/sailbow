"use client";
import {
  TripPageContainer,
  TripPageContent,
  TripPageHeader,
  TripPageTitle,
} from "../_components/trip-page-components";
import InviteButton from "./invite-button";
import { CrewTable } from "./crew-table";
import { PendingAndDeclinedInvitesTable } from "./pending-declined-invites-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoolTabs } from "@/components/ui/cool-tabs";
import { useState } from "react";

export default function CrewPage() {
  const [activeTab, setActiveTab] = useState("joined");
  return (
    <TripPageContainer>
      <TripPageHeader>
        <TripPageTitle>Crew</TripPageTitle>
        <InviteButton />
      </TripPageHeader>
      <TripPageContent className="pt-4">
        <div className="flex w-full items-center justify-center">
          <CoolTabs
            tabs={[
              { id: "joined", label: "Joined" },
              { id: "pending-and-declined", label: "Pending & Declined " },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {activeTab === "joined" && <CrewTable />}
        {activeTab === "pending-and-declined" && (
          <PendingAndDeclinedInvitesTable />
        )}
      </TripPageContent>
    </TripPageContainer>
  );
}
