import { query } from "../_generated/server";
import { withUser } from "../authUtils";

export const myUnread = query({
  handler: async (ctx) => {
    return await withUser(ctx.auth, ctx.db, async (user) => {
      const unread = await ctx.db
        .query("notifications")
        .withIndex("by_userId", q => q.eq("userId", user.userId))
        .filter(q => q.eq(q.field("dismissed"), false))
        .collect();

      
      return unread;
    })
  }
})