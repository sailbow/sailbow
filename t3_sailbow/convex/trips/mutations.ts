import { mutation } from "@convex/_generated/server";
import { withUser } from "@convex/authUtils";
import { SbError } from "@convex/errorUtils";
import { tripSchema } from "@convex/schema";
import { ConvexError, v } from "convex/values";

export const create = mutation({
  args: tripSchema,
  handler: async ({ auth, db }, args) => {
    return await withUser(auth, async (user) => {
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
    await withUser(auth, async () => {
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
    await withUser(auth, async () => {
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
    await withUser(auth, async () => {
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
    await withUser(auth, async () => {
      await db.patch(tripId, { name });
    })
  }
})

export const deleteTrip = mutation({
  args: {
    tripId: v.id("trips"),
  },
  handler: async ({ auth, db }, args) => {
    await withUser(auth, async () => {
      await db.delete(args.tripId);
    })
  }
})
