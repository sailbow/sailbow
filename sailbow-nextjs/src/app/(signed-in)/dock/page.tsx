import { userService } from "@/lib";
import { db } from "@/db";
import { boats, crewMembers } from "@/db/schema";
import { eq, InferSelectModel } from "drizzle-orm";
import {
  Card,
  CardBody,
  CardHeader,
  HStack,
  Heading,
  Divider,
  Text,
} from "@chakra-ui/react";
import BoatsContainer from "../../_components/BoatsContainer";
import { ClerkLoaded } from "@clerk/nextjs";

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
  const boats = memberships.map((m) => m.boat);
  return (
    <BoatsContainer boats={boats} />
  )
}
