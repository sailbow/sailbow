import { Center, Heading, Stack } from "@chakra-ui/react";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await currentUser()
  if (user) redirect("/dock")
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
          <Link href="/sign-in">Sign In</Link>
        </Stack>
      </Center>
    </main>
  );
}
