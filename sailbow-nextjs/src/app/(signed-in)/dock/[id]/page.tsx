import { db } from "@/db";
import { type Boat, boats } from "@/db/schema";
import { Heading, Stack, Text } from "@chakra-ui/react";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

async function GetBoatById(boatId: number): Promise<Boat | undefined> {
  console.log(`Boat id: ${boatId}`)
  return await db.query.boats.findFirst({
    where: eq(boats.id, boatId),
    with: { banner: true },
  });
}

export default async function BoatPage({ params }: { params: { id: number } }) {
  const boat: Boat | undefined = await GetBoatById(params.id);

  if (!boat) notFound();

  return (
    <Stack>
      <Heading>{boat.name}</Heading>
      <Text>{boat.description}</Text>
    </Stack>
  )
}
