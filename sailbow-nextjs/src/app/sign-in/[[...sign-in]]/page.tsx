import { SignIn } from "@clerk/nextjs";
import { Center } from "@chakra-ui/react";

export default function Page() {
  return (
    <Center p={4}>
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#38B2AC",
          }
        }}
      />
    </Center>
  );
}
