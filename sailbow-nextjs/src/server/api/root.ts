import { dockRouter } from "@/server/api/routers/dockRouter"
import { imagesRouter } from "@/server/api/routers/imagesRouter"
import { createTRPCRouter } from "@/server/api/trpc";
import { invitationsRouter } from "@/server/api/routers/invitationsRouter";
import { modulesRouter } from "./routers/modulesRouter";

/**
 * This is the primary router
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  dock: dockRouter,
  images: imagesRouter,
  invitations: invitationsRouter,
  modules: modulesRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
