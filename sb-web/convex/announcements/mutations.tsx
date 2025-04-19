import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";
import { withUser } from "../authUtils";
import { announcementSchema } from "../schema";
import { throwIfNotMember } from "../tripUtils";
import { getOneFromOrThrow } from "convex-helpers/server/relationships";

export const create = mutation({
  args: announcementSchema,
  handler: async (ctx, args) => {
    return await withUser(ctx.auth, ctx.db, async (user) => {
      await throwIfNotMember(user, args.tripId, ctx.db);
      const announcementId = await ctx.db.insert("announcements", {
        ...args,
        createdBy: user.userId,
      });
      const crew = await ctx.db
        .query("crews")
        .withIndex("by_tripId", (q) => q.eq("tripId", args.tripId))
        .collect();
      await Promise.all(
        crew.map(async (cm) => {
          if (cm.email !== user.email) {
            const targetUser = await ctx.db
              .query("users")
              .withIndex("by_email", (q) =>
                q.eq("email", cm.email.toLowerCase()),
              )
              .first();
            if (targetUser) {
              await ctx.db.insert("notifications", {
                type: "announcement",
                userId: targetUser._id,
                dismissed: false,
                data: {
                  announcementId,
                  announcerName: user.givenName!,
                  tripId: args.tripId,
                },
              });
            }
          }
        }),
      );
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
