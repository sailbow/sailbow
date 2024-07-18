import {
  BoatPageContainer,
  BoatPageContent,
  BoatPageHeader,
} from "../boat-page-components";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <BoatPageContainer>
      <Skeleton className="bg-slate-300">
        <BoatPageHeader className="rounded-md" />
      </Skeleton>
      <BoatPageContent className="overflow-hidden rounded-md">
        <Skeleton className="size-full bg-slate-300" />
      </BoatPageContent>
    </BoatPageContainer>
  );
}
