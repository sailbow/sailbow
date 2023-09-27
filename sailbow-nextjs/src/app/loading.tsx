import {
  HStack,
  Skeleton,
  Center,
  Box,
  Spinner,
  Stack,
} from "@chakra-ui/react";

export default function Loading() {
  return (
    <Stack>
      <Skeleton>
        <Box h="100vh" rounded="lg" />
      </Skeleton>
    </Stack>
  );
}
