import { dockRouter } from "@/server/api/routers/dockRouter"
import { imagesRouter } from "@/server/api/routers/imagesRouter"
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  dock: dockRouter,
  images: imagesRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
