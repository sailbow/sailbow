"use client";

import { useConvexAuth } from "convex/react";
import { RedirectToSignIn } from "@clerk/clerk-react";

export default function ConvexAuthenticated({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) return null;

  if (!isAuthenticated) return <RedirectToSignIn />;
  return children;
}
