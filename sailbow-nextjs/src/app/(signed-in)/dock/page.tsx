import { BoatsContainer, CreateBoatFlyoutForm } from "@/components"
import { api } from "@/trpc/server";
import { Box, Flex } from "@chakra-ui/react";
import { inferAsyncReturnType } from "@trpc/server";

type GetBoatsResponse = inferAsyncReturnType<typeof api.dock.getBoats.query>

export default async function DockPage() {
  // Option 2: trpc
  const boatsFromTrpc: GetBoatsResponse = await api.dock.getBoats.query()

  return (
    <Flex gap="2">
      <Box flex={3}>
        <BoatsContainer boats={boatsFromTrpc} />
      </Box>
      <Box flex={1}>
        <CreateBoatFlyoutForm />
      </Box>
    </Flex>
  )
}
