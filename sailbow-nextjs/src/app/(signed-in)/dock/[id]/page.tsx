import { db } from "@/server/db";
import { boats, type BoatAndBanner } from "@/server/db/schema";
import { Heading, Stack, Text } from "@chakra-ui/react";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

async function GetBoatById(boatId: number): Promise<BoatAndBanner | undefined> {
  return await db.query.boats.findFirst({
    where: eq(boats.id, boatId),
    with: { banner: true },
  });
}

export default async function BoatPage({ params }: { params: { id: number } }) {
  const boat: BoatAndBanner | undefined = await GetBoatById(params.id);

  if (!boat) notFound();

  return (
    <Stack>
      <Heading>{boat.name}</Heading>
      <Text>{boat.description}</Text>
    </Stack>
  )
}
