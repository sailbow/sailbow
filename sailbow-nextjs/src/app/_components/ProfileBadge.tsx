import { ClerkLoading, ClerkLoaded, UserButton } from "@clerk/nextjs";
import { Flex, Spinner } from "@chakra-ui/react";

export default async function ProfileBadge() {
  return (
    <Flex alignItems="center">
      <ClerkLoading>
        <Spinner />
      </ClerkLoading>
      <ClerkLoaded>
        <UserButton afterSignOutUrl="/sign-in" />
      </ClerkLoaded>
    </Flex>
  );
}
