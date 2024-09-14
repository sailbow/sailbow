import { query } from "../_generated/server";
import { withUser } from "../authUtils";
import { SbError } from "../errorUtils";
import { getOneFromOrThrow } from "convex-helpers/server/relationships";
import { v } from "convex/values";
import { throwIfNotMember } from "../tripUtils";

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
});

export const listPendingAndDeclined = query({
  args: {
    tripId: v.id("trips"),
  },
  handler: async (ctx, args) => {
    return await withUser(ctx.auth, ctx.db, async (user) => {
      await throwIfNotMember(user, args.tripId, ctx.db);
      const pendingAndDeclined = await ctx.db
        .query("invitations")
        .withIndex("by_tripId", q => q.eq("tripId", args.tripId))
        .filter(q => q.or(
          q.eq(q.field("status"), "pending"),
          q.eq(q.field("status"), "declined")
        ))
        .collect();
      
      return pendingAndDeclined;
    })
  }
})