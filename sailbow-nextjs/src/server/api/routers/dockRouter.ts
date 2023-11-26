import { captainMiddleware, createTRPCRouter, protectedBoatProcedure, protectedProcedure } from "@/server/api/trpc";
import { GetBoatsContract, CreateBoatContract, GetBoatByIdContract } from "@/contracts/dock";
import { InferInsertModel, and, eq, inArray, isNull, or } from "drizzle-orm";
import { CrewMemberRole, InsertCrewMember, boatBanners, boats, crewMembers } from "@/server/db/schema";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs";
import { getBaseUrl, getUrl } from "@/trpc/shared";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const dockRouter = createTRPCRouter({
  createBoat: protectedProcedure
    .input(CreateBoatContract.requestSchema)
    .output(CreateBoatContract.responseSchema)
    .mutation(async ({ input, ctx }) => {
      const result = await db.transaction(async (tx) => {
        const insertBoatResult = await tx.insert(boats).values({
          name: input.name,
          description: input.description,
          captainUserId: ctx.auth.userId
        })
        const boatId = parseInt(insertBoatResult.insertId)
        const banner = {
            ...input.banner,
            boatId
        }
        await tx.insert(boatBanners).values(banner)
        const crew: InsertCrewMember[] = input.crewInvites.map(ci => {
          return {
            boatId,
            email: ci.emailAddress,
            role: ci.role as CrewMemberRole
          }
        })
        crew.push({ boatId, userId: ctx.auth.userId, role: "captain" })
        await tx.insert(crewMembers).values(crew)
        return { boatId }
      })
      
      // Send invitations
      // await Promise.all((input.crewInvites ?? []).map((invite) => {
      //   if (!ctx.auth.user?.emailAddresses.some(e => e.emailAddress === invite.emailAddress)) {
      //     return clerkClient.invitations.createInvitation({
      //       ...invite,
      //       redirectUrl: `${getBaseUrl()}/sign-in?redirectUrl=/dock/${boatId}`,
      //       publicMetadata: {
      //         inviterName: ctx.auth.user?.firstName,
      //         boatName: input.name
      //       }
      //     })
      //   }
      // }))
      return result
    }),

  getBoats: protectedProcedure
    .output(GetBoatsContract.responseSchema)
    .query(async ({ ctx }) => {
      const memberships = await ctx.db.query.crewMembers.findMany({
        where: or(
          eq(crewMembers.userId, ctx.auth.userId),
          eq(crewMembers.email, ctx.auth.primaryEmail)
        ),
        with: {
          boat: {
            with: {
              banner: true,
            },
          },
        },
      })

      const pendingMemberships = memberships.filter(m => m.userId === null)
      if (pendingMemberships.length > 0) {
        ctx.db
          .update(crewMembers)
          .set({ userId: ctx.auth.userId })
          .where(and(
            eq(crewMembers.email, ctx.auth.primaryEmail),
            isNull(crewMembers.userId)
          ))
      }
      return memberships.map((m) => m.boat) ?? []
    }),
  
  getBoatById: protectedProcedure
    .input(GetBoatByIdContract.requestSchema)
    .output(GetBoatByIdContract.responseSchema)
    .query(async ({ input, ctx }) => {
      const membership = await ctx.db.query.crewMembers.findFirst({
        where: and(
          eq(crewMembers.boatId, input.boatId),
          or(
            eq(crewMembers.userId, ctx.auth.userId),
            eq(crewMembers.email, ctx.auth.primaryEmail)
          )
        ),
        with: {
          boat: {
            with: {
              banner: input.includeBanner ? true : undefined,
              crew: input.includeCrew ? true : undefined
            }
          }
        }
      })
      if (!membership) {
        throw new TRPCError({
          code: "NOT_FOUND"
        })
      }

      return membership.boat
    }),

  deleteBoatById: protectedBoatProcedure
    .use(captainMiddleware)
    .input(z.object({
      boatId: z.number().min(1)
    }))
    .mutation(async ({ ctx }) => {
      await ctx.db.transaction(async (tx) => {
        await tx.delete(boats).where(eq(boats.id, ctx.boat.id))
        await tx.delete(boatBanners).where(eq(boatBanners.boatId, ctx.boat.id))
        await tx.delete(crewMembers).where(eq(crewMembers.boatId, ctx.boat.id))
      })
      revalidatePath("/dock", "page")
    })
})
