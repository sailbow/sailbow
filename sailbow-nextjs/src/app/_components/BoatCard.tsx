"use client";
import { Boat, BoatBanner } from "@/db/schema";
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

export default function BoatCard({ boat, banner }: { boat: Boat, banner: BoatBanner }): JSX.Element {
  return (
    <Card w="sm">
      <LinkOverlay as={NextLink} href={`/dock/${boat.id}`}>
        <CardBody>
          {banner.type == "color" ? (
            <Box h="sm" />
          ) : (
            <Image
              // boxSize="90%"
              alt={"Image for boat " + boat.name}
              src={banner.value}
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
