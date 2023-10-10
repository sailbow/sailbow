import { db } from "@/db";
import { type Boat, boats } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

async function GetBoatById(id: number): Promise<Boat | undefined> {
  return await db.query.boats.findFirst({
    where: eq(boats.id, id),
    with: { banner: true },
  });
}

export default async function BoatPage({ params }: { params: { id: number } }) {
  const boat: Boat | undefined = await GetBoatById(params.id);
  if (!boat) notFound();

  return <div>Page for boat id {params.id} </div>;
}
