import { query } from "@convex/_generated/server";
import { withUser } from "@convex/authUtils";
import { throwIfNotMember } from "@convex/tripUtils";
import { v } from "convex/values";

export const get = query({
  args: { tripId: v.id("trips") },
  handler: async ({ db, auth }, args) => {
    return await withUser(auth, async (user) => {
      await throwIfNotMember(user, args.tripId, db);
      return await db
        .query("announcements")
        .withIndex("by_tripId", (q) => q.eq("tripId", args.tripId))
        .collect();
    });
  },
});
