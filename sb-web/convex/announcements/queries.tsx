import { query } from "../_generated/server";
import { withUser } from "../authUtils";
import { throwIfNotMember } from "../tripUtils";
import { asyncMap } from "convex-helpers";
import { v } from "convex/values";

export const get = query({
  args: { tripId: v.id("trips") },
  handler: async ({ db, auth }, args) => {
    return await withUser(auth, db, async (user) => {
      await throwIfNotMember(user, args.tripId, db);
      const announcements = await db
        .query("announcements")
        .withIndex("by_tripId", (q) => q.eq("tripId", args.tripId))
        .order("desc")
        .collect();

      return await asyncMap(announcements, async (announcement) => {
        const createdBy = await db.get(announcement.createdBy);
        return {
          ...announcement,
          createdByUser: createdBy!,
        };
      });
    });
  },
});
