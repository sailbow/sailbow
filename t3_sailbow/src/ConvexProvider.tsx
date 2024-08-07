"use client";
import { type ReactNode } from "react";
import { env } from "./env";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";

const convexClient = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);
const convexQueryClient = new ConvexQueryClient(convexClient);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
    },
  },
});
convexQueryClient.connect(queryClient);
export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ConvexProviderWithClerk>
  );
}
