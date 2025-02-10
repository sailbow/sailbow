import { cn } from "@/lib/utils";
import React from "react";

const TripPageContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex min-h-screen flex-col", className)}
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
      "container sticky top-0 z-40 mx-auto min-h-10 bg-background py-4",
      className,
    )}
  >
    <div className="flex h-full items-center justify-between" {...props} />
  </header>
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
  <div ref={ref} className={cn("flex-grow overflow-auto", className)}>
    <div className="container mx-auto" {...props} />
  </div>
));

TripPageContent.displayName = "TripPageContent";

export { TripPageContainer, TripPageHeader, TripPageTitle, TripPageContent };
