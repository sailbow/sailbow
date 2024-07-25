"use client";

import { Authenticated } from "convex/react";

export default function ConvexAuthenticated({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Authenticated>{children}</Authenticated>;
}
