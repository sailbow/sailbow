import {
  BoatPageContainer,
  BoatPageContent,
  BoatPageHeader,
  BoatPageTitle,
} from "../../trip-page-components";
import InviteButton from "./invite-button";
import { CrewTable } from "./crew-table";
import { PendingAndDeclinedInvitesTable } from "./pending-declined-invites-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CrewPage() {
  return (
    <BoatPageContainer>
      <Tabs defaultValue="joined">
        <BoatPageHeader className="w-full justify-between">
          <BoatPageTitle>Crew</BoatPageTitle>
          <div className="ml-auto">
            <InviteButton />
          </div>
        </BoatPageHeader>
        <BoatPageContent className="pt-4">
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
        </BoatPageContent>
      </Tabs>
    </BoatPageContainer>
  );
}
