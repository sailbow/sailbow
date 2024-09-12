import { v } from "convex/values";
import { query } from "../_generated/server";
import { withUser } from "../authUtils";
import { throwIfNotMember } from "../tripUtils";
import { type Doc } from "../_generated/dataModel";

export const getTripModules = query({
  args: {
    tripId: v.id("trips")
  },
  handler: async (ctx, args): Promise<Doc<"modules">[]> => {
    return await withUser(ctx.auth, ctx.db, async (user) => {
      await throwIfNotMember(user, args.tripId, ctx.db);
      const modules = await ctx.db.query("modules")
        .withIndex("by_tripId", q => q.eq("tripId", args.tripId))
        .collect();
        return modules;
    })
  }
})