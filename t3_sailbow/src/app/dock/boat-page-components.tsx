import { cn } from "@/lib/utils";
import React from "react";

const BoatPageContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex size-full flex-col space-y-2 sm:container", className)}
    {...props}
  />
));

BoatPageContainer.displayName = "BoatPage";

const BoatPageHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex min-h-12 w-full gap-4", className)}
    {...props}
  />
));

BoatPageHeader.displayName = "BoatPageHeader";

const BoatPageTitle = React.forwardRef<
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

BoatPageTitle.displayName = "BoatPageTitle";

const BoatPageContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex-1 overflow-auto", className)} {...props} />
));

BoatPageContent.displayName = "BoatPageContent";

export { BoatPageContainer, BoatPageHeader, BoatPageTitle, BoatPageContent };
