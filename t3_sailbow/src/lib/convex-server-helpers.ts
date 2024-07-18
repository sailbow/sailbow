import { auth } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { type Preloaded } from "convex/react";
import { type FunctionReference } from "convex/server";

export async function preloadProtectedQuery<Query extends FunctionReference<"query">>(
  query: Query,
  args: Query["_args"]
): Promise<Preloaded<Query>> {
  const token = (await auth().getToken({ template: "convex" })) ?? undefined;
  return await preloadQuery(query, args, { token });
}