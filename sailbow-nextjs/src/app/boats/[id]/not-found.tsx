import { Center, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <Center>
      <Heading>Oops! This boat was not found</Heading>
      <Link href="/">
        <Text>Return home</Text>
      </Link>
    </Center>
  );
}
