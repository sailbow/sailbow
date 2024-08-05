// import { captainMiddleware, createTRPCRouter, protectedBoatProcedure, protectedProcedure, requiredRoleMiddleware } from "@/server/api/trpc";
// import { type InferInsertModel, and, eq, isNull, or, like, ilike, inArray, exists } from "drizzle-orm";
// import { db } from "@/server/db";
// import { TRPCError } from "@trpc/server";
// import { z } from "zod";
// import { revalidatePath } from "next/cache";
// import { boats, crewMembers, lower } from "@/server/db/schema";
// import { clerkClient } from "@clerk/nextjs/server";
// import { getUrl } from "@/trpc/shared";
// import { createBoatSchema, bannerSchema } from "@/lib/schemas/boat";

// type InsertBoat = InferInsertModel<typeof boats>
// type InsertCrewMember = InferInsertModel<typeof crewMembers>

// export const dockRouter = createTRPCRouter({
//   getBoats: protectedProcedure
//     .query(async ({ ctx }) => {
//       const memberships = await ctx.db.query.crewMembers.findMany({
//         where: or(
//           eq(crewMembers.userId, ctx.auth.userId),
//           eq(crewMembers.email, ctx.auth.sessionClaims.email)
//         ),
//         with: {
//           boat: true,
//         },
//       })
//       return memberships.map((m) => m.boat) ?? []
//     }),
  
//   getBoatById: protectedProcedure
//     .input(z.object({
//         boatId: z.coerce.number().min(1),
//     }))
//     .query(async ({ input, ctx }) => {
//       const membership = await ctx.db.query.crewMembers.findFirst({
//         where: and(
//           eq(crewMembers.boatId, input.boatId),
//           or(
//             eq(crewMembers.userId, ctx.auth.userId),
//             eq(crewMembers.email, ctx.auth.sessionClaims.email)
//           )
//         ),
//         with: {
//           boat: {
//             with: {
//               crew: true
//             }
//           }
//         }
//       })
//       if (!membership) {
//         return null;
//       }

//       return membership.boat;
//     }),

//   deleteBoatById: protectedProcedure
//     .use(captainMiddleware)
//     .input(z.object({
//       boatId: z.number().min(1)
//     }))
//     .mutation(async ({ ctx, input }) => {
//       await ctx.db.transaction(async (tx) => {
//         await tx.delete(crewMembers).where(eq(crewMembers.boatId, input.boatId))
//         await tx.delete(boats).where(eq(boats.id, input.boatId))
//       })
//       revalidatePath("/trips");
//     }),
  
//   searchBoats: protectedProcedure
//     .input(z.object({
//       query: z.string()
//     }))
//     .query(async ({ input, ctx }) => {
//       return (await ctx.db.query.boats.findMany({
//         where: and(
//           exists(ctx.db
//             .select({ userId: crewMembers.userId })
//             .from(crewMembers)
//             .where(and(
//               eq(crewMembers.boatId, boats.id),
//               eq(crewMembers.userId, ctx.auth.userId)
//             ))
//           ),
//           ilike(boats.name, `%${input.query}%`)
//         ),
//         limit: 50
//       }));
//     }),

//   editBoatBanner: protectedProcedure
//     .use(captainMiddleware)
//     .input(z.object({
//       boatId: z.number(),
//       banner: bannerSchema.or(z.null())
//     }))
//     .mutation(async ({ ctx, input }) => {
//       await ctx.db
//         .update(boats)
//         .set({ banner: input.banner})
//         .where(eq(boats.id, ctx.boat.id));
//     }),

//   editBoatDescription: protectedProcedure
//     .use(captainMiddleware)
//     .input(z.object({
//       boatId: z.number(),
//       description: z.string().nullable(),
//     }))
//     .mutation(async ({ input, ctx }) => {
//       await ctx.db
//         .update(boats)
//         .set({ description: input.description })
//         .where(eq(boats.id, ctx.boat.id));
//     })
// })