import { query } from "@convex/_generated/server";
import { withUser } from "@convex/authUtils";
import { throwIfNotMember } from "@convex/tripUtils";
import { asyncMap } from "convex-helpers";
import { getManyFrom } from "convex-helpers/server/relationships";
import { v } from "convex/values";

export const get = query({
  args: { tripId: v.id("trips") },
  handler: async ({ db, auth }, args) => {
    return await withUser(auth, async (user) => {
      await throwIfNotMember(user, args.tripId, db);
      const announcements = await db
        .query("announcements")
        .withIndex("by_tripId", (q) => q.eq("tripId", args.tripId))
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
