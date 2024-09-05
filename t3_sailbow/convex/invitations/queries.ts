import { query } from "@convex/_generated/server";
import { withUser } from "@convex/authUtils";
import { SbError } from "@convex/errorUtils";
import { getOneFromOrThrow } from "convex-helpers/server/relationships";
import { ConvexError, v } from "convex/values";

export const byId = query({
  args: {
    inviteId: v.id("invitations")
  },
  handler: async (ctx, args) => {
    return await withUser(ctx.auth, ctx.db, async (user) => {
      const invite = await ctx.db.query("invitations")
        .withIndex("by_id", q => q.eq("_id", args.inviteId))
        .unique();

      if (!invite || invite.email !== user.email) throw new SbError({
        code: "USER_ERROR",
        message: "Invitation is expired or invalid"
      });
      
      return {
        ...invite,
        invitedBy: await getOneFromOrThrow(ctx.db, "users", "by_id", invite.invitedByUserId, "_id"),
        tripName: (await getOneFromOrThrow(ctx.db, "trips", "by_id", invite.tripId, "_id")).name
      }
    })
  }
})