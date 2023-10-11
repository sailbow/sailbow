"use client";
import BoatCard from "./BoatCard";
import { Box, Grid, SimpleGrid, Stack } from "@chakra-ui/react";
import { type Boat } from "@/db/schema";

interface Props {
  boats: Boat[];
}
export default function BoatsContainer({ boats }: Props): JSX.Element {
  return (
    <SimpleGrid minChildWidth='120px' spacing='10px'>
      {boats.map((boat) => (
        <Box key={boat.id}>
          <BoatCard boat={boat} />
        </Box>
      ))}
    </SimpleGrid>
  );
}
