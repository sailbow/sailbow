import { mutation } from "@convex/_generated/server";
import { getUser } from "@convex/authUtils";
import { SbError } from "@convex/errorUtils";
import { crewMemberSchema, tripSchema } from "@convex/schema";
import { getOneFrom } from "convex-helpers/server/relationships";
import { v } from "convex/values";

export const createTrip = mutation({
  args: tripSchema,
  handler: async (ctx, args) => {
    const user = await getUser(ctx.auth);
    const tripId = await ctx.db.insert("trips", args);
    await ctx.db.insert("crews", {
      tripId,
      userId: user.tokenIdentifier,
      role: "captain",
      email: user.email!
    })
    
    return { tripId };
  }
});

export const updateTripDescription = mutation({
  args: {
    tripId: v.id("trips"),
    description: v.string()
  },
  handler: async (ctx, args) => {
    await getUser(ctx.auth);
    await ctx.db.patch(args.tripId, { description: args.description });
  }
});

export const updateTripBanner = mutation({
  args: {
    tripId: v.id("trips"),
    banner: tripSchema.banner
  },
  handler: async (ctx, args) => {
    await getUser(ctx.auth);
    await ctx.db.patch(args.tripId, { banner: args.banner });
  }
});

export const inviteCrewMember = mutation({
  args: {
    tripId: v.id("trips"),
    email: v.string(),
    role: v.union(v.literal("crewMember"), v.literal("firstMate"))
  },
  handler: async ({ db, auth }, args) => {
    const user = await getUser(auth);
    const existingCm = await db
      .query("crews")
      .filter(q => q.and(
        q.eq(q.field("tripId"), args.tripId),
        q.eq(q.field("email"), args.email)
      ))
      .first();

    if (existingCm) throw new SbError(
      {
        code: "USER_ERROR",
        message: `User with email '${existingCm.email}' has already been invited!`
      }
    );

    await db.insert("crews", args);
  }
});
