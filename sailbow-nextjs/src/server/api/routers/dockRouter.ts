import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { GetBoatsContract, CreateBoatContract } from "@/contracts/dock";
import { eq } from "drizzle-orm";
import { boatBanners, boats, crewMembers } from "@/server/db/schema";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";

export const dockRouter = createTRPCRouter({
  createBoat: protectedProcedure
    .input(CreateBoatContract.requestSchema)
    .output(CreateBoatContract.responseSchema)
    .mutation(async ({ input, ctx }) => {
      const insertBoatResult = await db.insert(boats).values({
        name: input.name,
        description: input.description,
        captainUserId: ctx.auth.userId
      })
      const boatId: number = parseInt(insertBoatResult.insertId)
      const banner = {
          ...input.banner,
          boatId: boatId
      }
      await db.insert(boatBanners).values(banner)
      await db.insert(crewMembers).values({ boatId, userId: ctx.auth.userId, role: "captain" })
      return { boatId }
    }),

  getBoats: protectedProcedure
    .output(GetBoatsContract.responseSchema)
    .query(async ({ ctx }) => {
      const memberships = await ctx.db.query.crewMembers.findMany({
        where: eq(crewMembers.userId, ctx.auth.userId),
        with: {
          boat: {
            with: {
              banner: true,
            },
          },
        },
      })
      return memberships.map((m) => m.boat) ?? []
    })
})
