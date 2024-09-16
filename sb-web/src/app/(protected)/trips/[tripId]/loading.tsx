import {
  TripPageContainer,
  TripPageContent,
  TripPageHeader,
} from "../trip-page-components";

export default function Loading() {
  return (
    <TripPageContainer className="space-y-2">
      <TripPageHeader className="animate-pulse rounded-md bg-slate-200"></TripPageHeader>
      <TripPageContent className="animate-pulse overflow-hidden rounded-md bg-slate-200"></TripPageContent>
    </TripPageContainer>
  );
}
