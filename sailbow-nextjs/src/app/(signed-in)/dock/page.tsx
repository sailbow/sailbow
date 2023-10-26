import { userService } from "@/lib";
import { db } from "@/db";
import {
  crewMembers,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { BoatsContainer } from "@/components"
import { Box, Flex } from "@chakra-ui/react";
import CreateBoatForm from "@/app/_components/CreateBoatForm";

export default async function DockPage() {
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

  return (
    <Flex alignItems="" gap="2">
      <Box flex={3}>
        <BoatsContainer boats={boats} />
      </Box>
      <Box flex={1}>
        <CreateBoatForm />
      </Box>
    </Flex>
  )
}
