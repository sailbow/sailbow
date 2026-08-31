import { v } from "convex/values";
import { type Doc } from "../_generated/dataModel";
import { query } from "../_generated/server";
import { withUser } from "../authUtils";
import { throwIfNotMember } from "../tripUtils";


export const list = query({
  args: {
    tripId: v.id("trips")
  },
  handler: async (ctx, args) => {
    return await withUser(ctx.auth, ctx.db, async (user) => {
      await throwIfNotMember(user, args.tripId, ctx.db);
      const items = await ctx.db.query("itineraryItems")
        .withIndex("by_tripId", q => q.eq("tripId", args.tripId))
        .collect();

      const grouped = items.reduce((result, current) => {
        const existing = result.get(current.date);
        if (existing) {
          result.set(current.date, [...existing, current]);
        } else {
          result.set(current.date,[current]);
        }
        return result;
      },  new Map<number, Doc<"itineraryItems">[]>());
      console.log(grouped);
      const results: { date: number, items: Doc<"itineraryItems">[] }[] = [];
      for (const group of grouped) {
        results.push({
          date: group[0],
          items: group[1]
        })
      }

      return results.sort((a, b) => a.date - b.date);
    })
  }
})