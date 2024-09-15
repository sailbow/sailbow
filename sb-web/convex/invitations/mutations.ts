import { internal } from "../_generated/api";
import { mutation } from "../_generated/server";
import { withUser } from "../authUtils";
import { getOneFromOrThrow } from "convex-helpers/server/relationships";
import { ConvexError, v } from "convex/values";
import { throwIfNotMember } from "../tripUtils";

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
        .withIndex("by_email_and_tripId", q => q.eq("email", args.email.toLowerCase()).eq("tripId", args.tripId))
        .filter(q => q.eq(q.field("status"), "pending"))
        .first();

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
      
      const userRecord = await db.query("users")
        .withIndex("by_email", q => q.eq("email", args.email.toLowerCase()))
        .first();
      
      if (!!userRecord) {
        await db.insert("notifications", {
          userId: userRecord._id, 
          type: "invite",
          data: { inviteId },
          dismissed: false
        });
      }

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

export const cancel = mutation({
  args: {
    inviteId: v.id("invitations")
  },
  handler: async (ctx, args) => {
    return await withUser(ctx.auth, ctx.db, async (user) => {
      const invite = await getOneFromOrThrow(ctx.db, "invitations", "by_id", args.inviteId, "_id");
      const membership = await throwIfNotMember(user, invite.tripId, ctx.db);
      if (membership.role !== "captain" && membership.role !=="firstMate") {
        throw new ConvexError({
          code: "USER_ERROR",
          message: "Only the captain or first mates can cancel invitations!"
        });
      }
      await ctx.db.delete(invite._id);
    })
  }
});