import { Center, Heading, Stack } from "@chakra-ui/react";
import { ReturnHomeLinkButton } from "@/components"

export default function DefaultNotFound() {
  return (
    <Center>
      <Stack alignItems="center" spacing="30px">
        <Heading>Oops! This page was not found</Heading>
        <ReturnHomeLinkButton />
      </Stack>
    </Center>
  );
}
