import { userService } from "@/lib";
import { db } from "@/server/db";
import {
  crewMembers,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { BoatsContainer, CreateBoatFlyoutForm } from "@/components"
import { api } from "@/trpc/server";
import { GetBoatsContract, InferResponseType } from "@/contracts";
import { Box, Flex } from "@chakra-ui/react";

type GetBoatsResponse = InferResponseType<typeof GetBoatsContract>

export default async function DockPage() {
  // Option 1: Direct db calls
  const user = await userService.getUser();
  const memberships = await db.query.crewMembers.findMany({
    where: eq(crewMembers.userId, user.id),
    with: {
      boat: {
        with: {
          banner: true,
        },
      },
    },
  });
  const boats = memberships.map((m) => m.boat) ?? []

  // Option 2: trpc
  // const boatsFromTrpc: GetBoatsResponse = await api.dock.getBoats.query()

  return (
    <Flex gap="2">
      <Box flex={3}>
        <BoatsContainer boats={boats} />
      </Box>
      <Box flex={1}>
        <CreateBoatFlyoutForm />
      </Box>
    </Flex>
  )
}
