import { internal } from "../_generated/api";
import { mutation } from "../_generated/server";
import { withUser } from "../authUtils";
import { getOneFromOrThrow } from "convex-helpers/server/relationships";
import { ConvexError, v } from "convex/values";

export const create = mutation({
  args: {
    tripId: v.id("trips"),
    role: v.union(v.literal("crewMember"), v.literal("firstMate")),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await withUser(ctx.auth, ctx.db, async (user) => {
      const { db } = ctx;
      const existingInvite = await db.query("invitations")
        .withIndex("by_email_and_tripId", q => q.eq("email", args.email).eq("tripId", args.tripId))
        .unique();

      if (!!existingInvite) throw new ConvexError({
        code: "USER_ERROR",
        message: `User with email '${args.email}' has already been invited`
      });

      const existingCrewMember = await db.query("crews")
        .withIndex("by_email_and_tripId", q => q.eq("email", args.email).eq("tripId", args.tripId))
        .unique();

      if (!!existingCrewMember) throw new ConvexError({
        code: "USER_ERROR",
        message: `User with email '${args.email}' is already part of the crew!`
      });

      const inviteId = await db.insert("invitations", {
        ...args,
        invitedByUserId: user.userId,
        status: "pending",
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      await ctx.scheduler.runAfter(0, internal.invitations.actions.sendTripInvite, {
        email: args.email,
        inviteId: inviteId,
        invitedByEmail: user.email!,
        invitedByName: user.name!,
        tripName: (await db.get(args.tripId))!.name
      })
    })
  }
})

export const accept = mutation({
  args: {
    inviteId: v.id("invitations")
  },
  handler: async (ctx, args) => {
    return await withUser(ctx.auth, ctx.db, async (user) => {
      const invite = await getOneFromOrThrow(ctx.db, "invitations", "by_id", args.inviteId, "_id");
      if (invite.email !== user.email || invite.status !== "pending") {
        throw new ConvexError({
          code: "USER_ERROR",
          message: "Invitation is expired or invalid"
        });
      }
      await ctx.db.insert("crews", {
        email: invite.email,
        role: invite.role,
        tripId: invite.tripId
      });
      await ctx.db.patch(invite._id, { status: "accepted" });
    })
  }
});

export const decline = mutation({
  args: {
    inviteId: v.id("invitations")
  },
  handler: async (ctx, args) => {
    return await withUser(ctx.auth, ctx.db, async (user) => {
      const invite = await getOneFromOrThrow(ctx.db, "invitations", "by_id", args.inviteId, "_id");
      if (invite.email !== user.email || invite.status !== "pending") {
        throw new ConvexError({
          code: "USER_ERROR",
          message: "Invitation is expired or invalid"
        });
      }
      await ctx.db.patch(invite._id, { status: "declined" });
    })
  }
});