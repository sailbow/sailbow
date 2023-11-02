"use client";
import { Boat, BoatBanner } from "@/server/db/schema";
import {
  Box,
  Image, LinkBox, LinkOverlay,
  Skeleton,
  Text
} from "@chakra-ui/react";
import NextLink from 'next/link';

export default function BoatCard({ boat, banner }: { boat: Boat, banner: BoatBanner }): JSX.Element {
  return (
    <LinkBox
      as='article'
      width="300px"
      height="300px"
      borderRadius="md"
      overflow="hidden"
      boxShadow="md">
      <Image
        src={banner.value} // Replace with your image URL
        alt={"Image for boat " + boat.name}
        objectFit="cover"
        width="100%"
        height="75%"
        fallback={<Skeleton w="100%" h="75%" />}
        pb="10px"
      />
      <Text
        p="2"
        fontSize="16px"
        fontWeight="bold"
        bg="white"
      >
        <LinkOverlay as={NextLink} href={`/dock/${boat.id}`}>
          {boat.name}
        </LinkOverlay>
      </Text>
    </LinkBox>
  );
}
