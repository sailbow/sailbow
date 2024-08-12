import { cn } from "@/lib/utils";
import React from "react";

const TripPageContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex size-full max-w-full flex-col space-y-2 overflow-hidden sm:container",
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
    className={cn("relative flex min-h-10 w-full gap-4", className)}
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
      "inline-flex break-normal text-3xl font-semibold leading-none tracking-tight",
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
    className={cn("relative grow overflow-hidden", className)}
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
