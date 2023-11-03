import { Center, Heading, Stack } from "@chakra-ui/react";
import GetStartedButton from "./GetStartedButton";
import Image from "next/image";

export default function Page() {
  return (
    <main>
      <Center p={5}>
        <Stack spacing={4} textAlign="center" alignItems="center">
          <Image
            width={40}
            height={40}
            src="/sailbow.svg"
            alt="Sailbow logo"
          />
          <Heading>Assemble your crew.</Heading>
          <Heading>Chart a course.</Heading>
          <Heading>Set sail.</Heading>
          <GetStartedButton />
        </Stack>
      </Center>
    </main>
  );
}
