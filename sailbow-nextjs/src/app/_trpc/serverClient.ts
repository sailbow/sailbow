import { httpBatchLink } from "@trpc/client";
import { appRouter } from "@/server";

export const serverClient = appRouter.createCaller({
  links: [
    httpBatchLink({
      url: process.env.WEBSITE_URL ?? "http://localhost:3000",
    }),
  ],
});