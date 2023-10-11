import { Center, Heading, Stack } from "@chakra-ui/react";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs";

export default async function Page() {
  const user = await currentUser();
  return (
    <main>
      <Center p={5}>
        <SignedIn>
          <Heading>Welcome {user?.firstName}!</Heading>
        </SignedIn>
        <SignedOut>
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
            <SignInButton />
          </Stack>
        </SignedOut>
      </Center>
    </main>
  );
}
