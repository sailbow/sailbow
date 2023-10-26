"use client";
import BoatCard from "./BoatCard";
import { Wrap, WrapItem } from "@chakra-ui/react";
import { BoatAndBanner } from "@/db/schema";


interface Props {
  boats: BoatAndBanner[];
}
export default function BoatsContainer({ boats }: Props): JSX.Element {
  return (
    <Wrap>
      {boats.map((boat) => (
        <WrapItem key={boat.id}>
          <BoatCard boat={boat} banner={boat.banner} />
        </WrapItem>
      ))}
    </Wrap>
  );
}
