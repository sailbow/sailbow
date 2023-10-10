"use client";
import { type Boat, type BoatBanner } from "@/db/schema";
import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Divider,
  Text,
  Box,
  Image,
  CardFooter,
} from "@chakra-ui/react";

export default function BoatCard({ boat }: { boat: Boat }): JSX.Element {
  console.log(boat.banner.value);
  return (
    <Card w="sm">
      <CardBody>
        {boat.banner.type == "color" ? (
          <Box h="sm" />
        ) : (
          <Image
            h="sm"
            alt={"Image for boat " + boat.name}
            src={boat.banner.value}
          />
        )}
        <Divider />
        <CardFooter>
          <Heading size="sm">{boat.name}</Heading>
        </CardFooter>
      </CardBody>
    </Card>
  );
}
