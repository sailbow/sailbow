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

export default function CrewPage() {
  return (
    <TripPageContainer>
      <TripPageHeader>
        <TripPageTitle>Crew</TripPageTitle>
        <InviteButton />
      </TripPageHeader>
      <TripPageContent className="pt-4">
        <Tabs defaultValue="joined">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="joined">Joined</TabsTrigger>
            <TabsTrigger value="pending-and-declined">
              Pending & Declined
            </TabsTrigger>
          </TabsList>
          <TabsContent value="joined">
            <CrewTable />
          </TabsContent>
          <TabsContent value="pending-and-declined">
            <PendingAndDeclinedInvitesTable />
          </TabsContent>
        </Tabs>
      </TripPageContent>
    </TripPageContainer>
  );
}
