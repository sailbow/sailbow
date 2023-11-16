import { db } from "@/server/db";
import { boats, type BoatAndBanner } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation"
import { api } from "@/trpc/server"
import BoatDetails from "./BoatDetails";
import { Box, Center, Flex, Heading } from "@chakra-ui/react";

async function GetBoatById(boatId: number) {
  return await db.query.boats.findFirst({
    where: eq(boats.id, boatId),
    with: { banner: true, crew: true },
  })
}


export default async function BoatPage({ params }: { params: { id: number } }) {
  const boat = await GetBoatById(params.id)

  if (!boat) return notFound()

  // if (!boat.crew.some(cm => cm.userId === ))
  return (
    <Flex direction="row">
      <Box flex={1} pr={5}>
        <BoatDetails boat={boat} />
      </Box>
      <Center flex={3}>
        <Heading size="xl">Modules container</Heading>
      </Center>
    </Flex>

  )
}
