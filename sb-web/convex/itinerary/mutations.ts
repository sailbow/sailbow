import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { withUser } from "../authUtils";
import { throwIfNotMember } from "../tripUtils";
import { getOneFromOrThrow } from "convex-helpers/server/relationships";

export const upsert = mutation({
  args: {
    _id: v.optional(v.id("itineraryItems")),
    tripId: v.id("trips"),
    title: v.string(),
    date: v.optional(v.number()),
    start: v.optional(v.string()),
    end: v.optional(v.string()),
    time: v.optional(v.union(v.null(), v.string())),
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
});

export const deleteItem = mutation({
  args: {
    itemId: v.id("itineraryItems"),
  },
  handler: async (ctx, args) => {
    return await withUser(ctx.auth, ctx.db, async (user) => {
      const item = await getOneFromOrThrow(ctx.db, "itineraryItems", "by_id", args.itemId, "_id");
      await throwIfNotMember(user, item.tripId, ctx.db);
      await ctx.db.delete(item._id);
    })
  }
})