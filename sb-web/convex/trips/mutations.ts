import { mutation } from "@convex/_generated/server";
import { withUser } from "@convex/authUtils";
import { tripSchema } from "@convex/schema";
import { ConvexError, v } from "convex/values";

export const create = mutation({
  args: tripSchema,
  handler: async ({ auth, db, }, args) => {
    return await withUser(auth, db, async (user) => {
      const tripId = await db.insert("trips", args);
      await db.insert("crews", {
        tripId,
        userId: user.tokenIdentifier,
        role: "captain",
        email: user.email!
      })
      
      return { tripId };
    });
  }
});

export const updateDescription = mutation({
  args: {
    tripId: v.id("trips"),
    description: v.string()
  },
  handler: async ({ auth, db }, args) => {
    await withUser(auth, db, async () => {
      await db.patch(args.tripId, { description: args.description });
    });
  }
});

export const updateTripBanner = mutation({
  args: {
    tripId: v.id("trips"),
    banner: tripSchema.banner
  },
  handler: async ({ auth, db }, { tripId, banner }) => {
    await withUser(auth, db, async () => {
      await db.patch(tripId, { banner });
    });
  }
});

export const inviteCrewMember = mutation({
  args: {
    tripId: v.id("trips"),
    email: v.string(),
    role: v.union(v.literal("crewMember"), v.literal("firstMate"))
  },
  handler: async ({ db, auth }, args) => {
    await withUser(auth, db, async () => {
      const existingCm = await db
      .query("crews")
      .filter(q => q.and(
        q.eq(q.field("tripId"), args.tripId),
        q.eq(q.field("email"), args.email)
      ))
      .first();

      if (existingCm) throw new ConvexError({
        code: "USER_ERROR",
        message: `User with email '${args.email}' has already been invited`
      });

      await db.insert("crews", args);
    });
  }
});

export const updateName = mutation({
  args: { tripId: v.id("trips"), name: v.optional(v.string()) },
  handler: async ({ auth, db }, { tripId, name }) => {
    await withUser(auth, db, async () => {
      await db.patch(tripId, { name });
    })
  }
})

export const deleteTrip = mutation({
  args: {
    tripId: v.id("trips"),
  },
  handler: async ({ auth, db }, args) => {
    await withUser(auth, db, async () => {
      await db.delete(args.tripId);
    })
  }
})

export const kickMember = mutation({
  args: { tripId: v.id("trips"), memberId: v.id("crews") },
  handler: async ({ auth, db }, { tripId, memberId }) => {
    await withUser(auth, db, async (user) => {
      const crew = await db.query("crews")
        .withIndex("by_tripId", q => q.eq("tripId", tripId))
        .collect();
      const userCrewEntry = crew.find(c => c.email === user.email);
      if (userCrewEntry?.role !== "captain") {
        throw new ConvexError({
          code: "USER_ERROR",
          message: "Only the captain can kick members!"
        });
      }
      if (userCrewEntry?._id === memberId) {
        throw new ConvexError({
          code: "USER_ERROR",
          message: "You can't kick yourself! Try transferring the trip to another member instead."
        });
      }
      await db.delete(memberId);
    })
  }
})

export const changeMemberRole = mutation({
  args: { tripId: v.id("trips"), memberId: v.id("crews"), role: v.union(v.literal("crewMember"), v.literal("firstMate")) },
  handler: async ({ auth, db }, { tripId, memberId, role }) => {
    await withUser(auth, db, async (user) => {
      const crew = await db.query("crews")
        .withIndex("by_tripId", q => q.eq("tripId", tripId))
        .collect();
      const userCrewEntry = crew.find(c => c.email === user.email);
      if (userCrewEntry?.role !== "captain" && userCrewEntry?.role !== "firstMate") {
        throw new ConvexError({
          code: "USER_ERROR",
          message: "Only the captain or first mates can change roles!"
        });
      }
      if (userCrewEntry?._id === memberId) {
        throw new ConvexError({
          code: "USER_ERROR",
          message: "You can't change your own role!"
        });
      }
      const targetMember = crew.find(c => c._id === memberId);
      if (targetMember!.role === "captain") {
        throw new ConvexError({
          code: "USER_ERROR",
          message: "You can't change the role of the captain!"
        })
      }
      await db.patch(memberId, { role });
    })
  }
});

