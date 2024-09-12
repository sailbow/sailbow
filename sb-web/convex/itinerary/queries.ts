import { v } from "convex/values";
import { type Doc } from "../_generated/dataModel";
import { query } from "../_generated/server";
import { withUser } from "../authUtils";
import { throwIfNotMember } from "../tripUtils";

export const list = query({
  args: {
    tripId: v.id("trips")
  },
  handler: async (ctx, args): Promise<Doc<"itineraryItems">[]> => {
    return await withUser(ctx.auth, ctx.db, async (user) => {
      await throwIfNotMember(user, args.tripId, ctx.db);
      const items = await ctx.db.query("itineraryItems")
        .withIndex("by_tripId", q => q.eq("tripId", args.tripId))
        .collect();
      return items;
    })
  }
})