import {
  BoatPageContainer,
  BoatPageContent,
  BoatPageHeader,
} from "../trip-page-components";

export default function Loading() {
  return (
    <BoatPageContainer className="space-y-2">
      <BoatPageHeader className="animate-pulse rounded-md bg-slate-300"></BoatPageHeader>
      <BoatPageContent className="animate-pulse overflow-hidden rounded-md bg-slate-300"></BoatPageContent>
    </BoatPageContainer>
  );
}
