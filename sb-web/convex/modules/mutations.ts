import { ConvexError } from "convex/values";
import { mutation } from "../_generated/server";
import { dateRangeSchema } from "../schema";
import { withUser } from "../authUtils";
import { throwIfNotMember } from "../tripUtils";

export const setTripDateRange = mutation({
  args: dateRangeSchema,
  handler: async (ctx, args) => {
    return await withUser(ctx.auth, ctx.db, async (user) => {
      const membership = await throwIfNotMember(user, args.tripId, ctx.db);
      if (!["captain", "firstMate"].includes(membership.role)) {
        throw new ConvexError({
          code: "USER_ERROR",
          message: "Only captains and first mates can set the trip dates!"
        })
      }
      const existingRange = await ctx.db.query("modules")
        .withIndex("by_tripId", q => q.eq("tripId", args.tripId))
        .filter(q => q.eq(q.field("type"), "date"))
        .first();

      if (existingRange) {
        await ctx.db.patch(existingRange._id, args);
      } else {
        await ctx.db.insert("modules", args);
      }
    });
  }
})