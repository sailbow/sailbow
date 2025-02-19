import { cn } from "@/lib/utils";
import React from "react";

const TripPageContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex w-full flex-col", className)} {...props} />
));

TripPageContainer.displayName = "TripPage";

const TripPageHeader = React.forwardRef<
  HTMLHeadElement,
  React.HTMLAttributes<HTMLHeadElement>
>(({ className, ...props }, ref) => (
  <header
    ref={ref}
    className={cn(
      "sticky top-0 z-50 flex min-h-12 items-center justify-between bg-background px-10 py-3",
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
  <div ref={ref} className={cn("min-h-dvh flex-grow", className)}>
    <div className="container mx-auto" {...props} />
  </div>
));

TripPageContent.displayName = "TripPageContent";

export { TripPageContainer, TripPageHeader, TripPageTitle, TripPageContent };
