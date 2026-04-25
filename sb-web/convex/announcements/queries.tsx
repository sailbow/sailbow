import { query } from "../_generated/server";
import { withUser } from "../authUtils";
import { throwIfNotMember } from "../tripUtils";
import { asyncMap } from "convex-helpers";
import { v } from "convex/values";
import reactions from "../lib/reactions";

export const get = query({
  args: { tripId: v.id("trips") },
  handler: async (ctx, args) => {
    return await withUser(ctx.auth, ctx.db, async (user) => {
      await throwIfNotMember(user, args.tripId, ctx.db);
      const announcements = await ctx.db
        .query("announcements")
        .withIndex("by_tripId", (q) => q.eq("tripId", args.tripId))
        .order("desc")
        .collect();

      return await asyncMap(announcements, async (announcement) => {
        const createdBy = await ctx.db.get(announcement.createdBy);
        const announcementReactions = await reactions.list(
          ctx,
          `announcements-${announcement._id}`,
        );
        return {
          ...announcement,
          reactions: announcementReactions.map((a) => ({
            label: a.label,
            userId: a.userId,
          })),
          createdByUser: createdBy!,
        };
      });
    });
  },
});
