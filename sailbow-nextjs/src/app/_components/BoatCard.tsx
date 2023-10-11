"use client";
import { type Boat } from "@/db/schema";
import {
  Card,
  CardBody,
  Heading,
  Divider,
  Box,
  Image,
  CardFooter,
  LinkOverlay,
} from "@chakra-ui/react";
import NextLink from 'next/link'

export default function BoatCard({ boat }: { boat: Boat }): JSX.Element {
  return (
    <Card w="sm">
      <LinkOverlay as={NextLink} href={`/dock/${boat.id}`}>
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
      </LinkOverlay>
    </Card>
  );
}
