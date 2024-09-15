import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { withUser } from "../authUtils";

export const dismiss = mutation({
  args: {
    notificationId: v.id("notifications")
  },
  handler: async (ctx, args) => {
    return await withUser(ctx.auth, ctx.db, async (user) => {
      const notification = await ctx.db
        .query("notifications")
        .withIndex("by_userId", q => q.eq("userId", user.userId))
        .filter(q => q.eq(q.field("_id"), args.notificationId))
        .first();
      
      if (notification && !notification.dismissed) {
        await ctx.db.patch(notification._id, { ...notification, dismissed: true});
      }
    });
  }
})