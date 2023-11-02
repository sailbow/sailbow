import { Wrap, WrapItem } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";

export default function Loading() {
  return (
    <Wrap spacing="4">
      {Array.from({ length: 3 }).map((_, index) => (
        <WrapItem key={index}>
          <Skeleton height="300px" width="300px" rounded="lg" />
        </WrapItem>
      ))}
    </Wrap>
  )
}
