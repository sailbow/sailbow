import { cn } from "@/lib/utils";
import React from "react";

const TripPageContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex size-full max-w-full flex-col overflow-auto sm:container",
      className,
    )}
    {...props}
  />
));

TripPageContainer.displayName = "BoatPage";

const TripPageHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "sticky top-0 z-40 flex min-h-10 w-full max-w-4xl gap-4 bg-background py-2 pr-1",
      className,
    )}
    {...props}
  />
));

TripPageHeader.displayName = "BoatPageHeader";

const TripPageTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn(
      "inline-flex break-normal text-2xl font-semibold leading-none tracking-tight sm:text-3xl",
      className,
    )}
    {...props}
  />
));

TripPageTitle.displayName = "BoatPageTitle";

const TripPageContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative max-w-4xl grow py-2", className)}
    {...props}
  />
));

TripPageContent.displayName = "BoatPageContent";

export {
  TripPageContainer as BoatPageContainer,
  TripPageHeader as BoatPageHeader,
  TripPageTitle as BoatPageTitle,
  TripPageContent as BoatPageContent,
};
