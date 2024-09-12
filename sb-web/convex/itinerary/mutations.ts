import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { itineraryItemSchema } from "../schema";
import { withUser } from "../authUtils";
import { throwIfNotMember } from "../tripUtils";
export const upsert = mutation({
  args: {
    _id: v.optional(v.id("itineraryItems")),
    tripId: v.id("trips"),
    title: v.string(),
    date: v.optional(v.string()),
    time: v.union(v.null(), v.string()),
    location: v.union(v.null(), v.string()),
    details: v.union(v.null(), v.string())
},
  handler: async (ctx, args) => {
    return await withUser(ctx.auth, ctx.db, async (user) => {
      await throwIfNotMember(user, args.tripId, ctx.db);
      if (args._id) {
        await ctx.db.patch(args._id, args);
      } else {
        await ctx.db.insert("itineraryItems", args);
      }
    })
  }
})