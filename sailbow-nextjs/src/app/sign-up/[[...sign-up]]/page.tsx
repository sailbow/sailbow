import { SignUp } from "@clerk/nextjs";
import { Center } from "@chakra-ui/react";

export default function Page() {
  return (
    <Center p={4}>
      <SignUp
        appearance={{
          variables: {
            colorPrimary: "#38B2AC",
          }
        }}
      />
    </Center>
  );
}
