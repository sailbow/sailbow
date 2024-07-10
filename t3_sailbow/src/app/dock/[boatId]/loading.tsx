import {
  BoatPageContainer,
  BoatPageContent,
  BoatPageHeader,
} from "../boat-page-components";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <BoatPageContainer>
      <Skeleton className="bg-gray-300 dark:bg-gray-500">
        <BoatPageHeader className="rounded-md" />
      </Skeleton>
      <BoatPageContent className="overflow-hidden rounded-md">
        <Skeleton className="size-full bg-gray-300 dark:bg-gray-500" />
      </BoatPageContent>
    </BoatPageContainer>
  );
}
