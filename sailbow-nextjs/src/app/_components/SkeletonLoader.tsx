import { Box, Skeleton } from "@chakra-ui/react";

export default function SkeletonLoader() {
  return (
    <Skeleton>
      <Box h="100vh" />
    </Skeleton>
  );
}
