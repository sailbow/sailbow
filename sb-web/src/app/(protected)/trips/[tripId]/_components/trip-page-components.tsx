import { cn } from "@/lib/utils";
import React from "react";

const TripPageContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex size-full flex-col pl-4 pr-14", className)}
    {...props}
  />
));

TripPageContainer.displayName = "TripPage";

const TripPageHeader = React.forwardRef<
  HTMLHeadElement,
  React.HTMLAttributes<HTMLHeadElement>
>(({ className, ...props }, ref) => (
  <header
    ref={ref}
    className={cn(
      "sticky top-0 z-50 mb-8 mr-auto mt-3 flex min-h-12 w-full max-w-5xl justify-between rounded-sm bg-card p-8 text-card-foreground",
      className,
    )}
    {...props}
  />
));

TripPageHeader.displayName = "TripPageHeader";

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

TripPageTitle.displayName = "TripPageTitle";

const TripPageContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("relative flex-1", className)}>
    <div
      className="mb-8 mt-4 size-full max-w-5xl rounded-sm bg-card p-8 text-card-foreground"
      {...props}
    />
  </div>
));

TripPageContent.displayName = "TripPageContent";

export { TripPageContainer, TripPageHeader, TripPageTitle, TripPageContent };
