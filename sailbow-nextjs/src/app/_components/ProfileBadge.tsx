import { ClerkLoading, ClerkLoaded, UserButton } from "@clerk/nextjs";
import { Flex, } from "@chakra-ui/react";
import { HelmSpinner } from "@/components"

export default async function ProfileBadge() {
  return (
    <Flex alignItems="center">
      <ClerkLoading>
        <HelmSpinner size={32} />
      </ClerkLoading>
      <ClerkLoaded>
        <UserButton afterSignOutUrl="/sign-in" />
      </ClerkLoaded>
    </Flex>
  );
}
