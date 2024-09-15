import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";
import { withUser } from "../authUtils";
import { announcementSchema } from "../schema";
import { throwIfNotMember } from "../tripUtils";
import { getOneFromOrThrow } from "convex-helpers/server/relationships";

export const create = mutation({
  args: announcementSchema,
  handler: async ({ db, auth }, args) => {
    return await withUser(auth, db, async (user) => {
      await throwIfNotMember(user, args.tripId, db);
      await db.insert("announcements", { ...args, createdBy: user.userId });
    });
  },
});

export const deleteAnnouncement = mutation({
  args: { announcementId: v.id("announcements"), tripId: v.id("trips") },
  handler: async (ctx, args) => {
    return await withUser(ctx.auth, ctx.db, async (user) => {
      const membership = await throwIfNotMember(user, args.tripId, ctx.db);
      const announcement = await getOneFromOrThrow(
        ctx.db,
        "announcements",
        "by_id",
        args.announcementId,
        "_id",
      );
      if (
        membership.role !== "captain" &&
        announcement.createdBy != user.userId
      ) {
        throw new ConvexError({
          code: "USER_ERROR",
          message:
            "Only the captain or the author of this announcement may delete it!",
        });
      }
      await ctx.db.delete(args.announcementId);
    });
  },
});
