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
      <TripPageHeader className="items-start">
        <div className="flex w-full flex-col gap-3">
          <TripPageTitle>Crew</TripPageTitle>
          <CoolTabs
            tabs={[
              { id: "joined", label: "Joined" },
              { id: "pending-and-declined", label: "Pending & Declined " },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <InviteButton />
      </TripPageHeader>
      <TripPageContent>
        {activeTab === "joined" && <CrewTable />}
        {activeTab === "pending-and-declined" && (
          <PendingAndDeclinedInvitesTable />
        )}
      </TripPageContent>
    </TripPageContainer>
  );
}
