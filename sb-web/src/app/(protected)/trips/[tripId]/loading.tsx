import {
  TripPageContainer,
  TripPageContent,
  TripPageHeader,
} from "../trip-page-components";

export default function Loading() {
  return (
    <TripPageContainer className="space-y-2">
      <TripPageHeader className="animate-pulse rounded-md bg-gray-200 dark:bg-gray-400"></TripPageHeader>
      <TripPageContent className="animate-pulse overflow-hidden rounded-md bg-gray-200 dark:bg-gray-400"></TripPageContent>
    </TripPageContainer>
  );
}
