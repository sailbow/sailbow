"use client";
import BoatCard from "./BoatCard";
import { SimpleGrid } from "@chakra-ui/react";
import { type Boat } from "@/db/schema";

interface Props {
  boats: Boat[];
}
export default function BoatsContainer({ boats }: Props): JSX.Element {
  return (
    <SimpleGrid
      spacing={4}
      templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
    >
      {boats.map((boat) => (
        <BoatCard key={boat.id} boat={boat} />
      ))}
    </SimpleGrid>
  );
}
