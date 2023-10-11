"use client";
import { Button, Center, Heading, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function DefaultNotFound() {
  const router = useRouter();
  return (
    <Center>
      <Stack alignItems="center" spacing="30px">
        <Heading>Oops! This page was not found</Heading>
        <Button
          colorScheme="blue"
          variant="outline"
          onClick={() => router.push("/")}
        >
          Return Home
        </Button>
      </Stack>
    </Center>
  );
}
