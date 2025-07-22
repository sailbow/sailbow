import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { withUser } from "../authUtils";
import { throwIfNotMember } from "../tripUtils";
import { locationValidator } from "../schema";
import { getOneFrom } from "convex-helpers/server/relationships";

export const list = query({
  args: {
    tripId: v.id("trips"),
  },
  handler: async (ctx, args) => {
    return await withUser(ctx.auth, ctx.db, async (user) => {
      await throwIfNotMember(user, args.tripId, ctx.db);
      return await ctx.db
        .query("itineraryItemsV2")
        .withIndex("by_tripId", (q) => q.eq("tripId", args.tripId))
        .collect();
    });
  },
});

export const upsert = mutation({
  args: {
    _id: v.optional(v.id("itineraryItemsV2")),
    tripId: v.id("trips"),
    title: v.string(),
    startDate: v.number(),
    endDate: v.union(v.number(), v.null()),
    type: v.union(v.null(), v.string()),
    location: v.optional(locationValidator),
    details: v.union(v.null(), v.string()),
  },
  handler: async (ctx, args) => {
    return await withUser(ctx.auth, ctx.db, async (user) => {
      await throwIfNotMember(user, args.tripId, ctx.db);
      if (args._id) {
        await ctx.db.patch(args._id, args);
      } else {
        await ctx.db.insert("itineraryItemsV2", args);
      }
    });
  },
});

export const deleteItem = mutation({
  args: {
    _id: v.id("itineraryItemsV2"),
  },
  handler: async (ctx, args) => {
    return await withUser(ctx.auth, ctx.db, async (user) => {
      const item = await ctx.db.get(args._id);
      if (!item) throw new Error("Cannot delete item that does not exist");
      await throwIfNotMember(user, item.tripId, ctx.db);
      await ctx.db.delete(args._id);
    });
  },
});
