import { mutation } from "../_generated/server";
import { withUser } from "../authUtils";
import { locationValidator, tripSchema } from "../schema";
import { ConvexError, v } from "convex/values";
import { throwIfNotMember } from "../tripUtils";

export const create = mutation({
  args: tripSchema,
  handler: async ({ auth, db }, args) => {
    return await withUser(auth, db, async (user) => {
      const tripId = await db.insert("trips", args);
      await db.insert("crews", {
        tripId,
        userId: user.userId,
        role: "captain",
        email: user.email!,
      });

      return { tripId };
    });
  },
});

export const updateDescription = mutation({
  args: {
    tripId: v.id("trips"),
    description: v.string(),
  },
  handler: async ({ auth, db }, args) => {
    await withUser(auth, db, async () => {
      await db.patch(args.tripId, { description: args.description });
    });
  },
});

export const updateDates = mutation({
  args: {
    tripId: v.id("trips"),
    dates: v.optional(
      v.object({
        start: v.number(),
        end: v.number(),
      }),
    ),
  },
  handler: async ({ auth, db }, args) => {
    return withUser(auth, db, async () => {
      return db.patch(args.tripId, { dates: args.dates });
    });
  },
});

export const updateLocation = mutation({
  args: {
    tripId: v.id("trips"),
    location: v.optional(locationValidator),
  },
  handler: async ({ auth, db }, args) => {
    return withUser(auth, db, async () => {
      return db.patch(args.tripId, { location: args.location });
    });
  },
});

export const updateBudget = mutation({
  args: {
    tripId: v.id("trips"),
    budget: v.optional(
      v.object({
        low: v.float64(),
        high: v.optional(v.float64()),
      }),
    ),
  },
  handler: async ({ auth, db }, args) => {
    return withUser(auth, db, async () => {
      return db.patch(args.tripId, { budget: args.budget });
    });
  },
});

export const updateTripBanner = mutation({
  args: {
    tripId: v.id("trips"),
    banner: tripSchema.banner,
  },
  handler: async ({ auth, db }, { tripId, banner }) => {
    await withUser(auth, db, async () => {
      await db.patch(tripId, { banner });
    });
  },
});

export const updateName = mutation({
  args: { tripId: v.id("trips"), name: v.optional(v.string()) },
  handler: async ({ auth, db }, { tripId, name }) => {
    await withUser(auth, db, async () => {
      await db.patch(tripId, { name });
    });
  },
});

export const deleteTrip = mutation({
  args: {
    tripId: v.id("trips"),
  },
  handler: async ({ auth, db }, args) => {
    await withUser(auth, db, async () => {
      await db.delete(args.tripId);
    });
  },
});

export const kickMember = mutation({
  args: { tripId: v.id("trips"), memberId: v.id("crews") },
  handler: async ({ auth, db }, { tripId, memberId }) => {
    await withUser(auth, db, async (user) => {
      const membership = await throwIfNotMember(user, tripId, db)
      console.log(membership)
      if (membership.role !== "captain" && membership.role !== "firstMate") {
        throw new ConvexError({
          code: "USER_ERROR",
          message: "Only the captain can kick members!",
        });
      }
      if (membership._id === memberId) {
        throw new ConvexError({
          code: "USER_ERROR",
          message:
            "You can't kick yourself! Try transferring the trip to another member instead.",
        });
      }

      await db.delete(memberId);
    });
  },
});

export const changeMemberRole = mutation({
  args: {
    tripId: v.id("trips"),
    memberId: v.id("crews"),
    role: v.union(v.literal("crewMember"), v.literal("firstMate")),
  },
  handler: async ({ auth, db }, { tripId, memberId, role }) => {
    await withUser(auth, db, async (user) => {
      const crew = await db
        .query("crews")
        .withIndex("by_tripId", (q) => q.eq("tripId", tripId))
        .collect();
      const userCrewEntry = crew.find((c) => c.email === user.email);
      if (
        userCrewEntry?.role !== "captain" &&
        userCrewEntry?.role !== "firstMate"
      ) {
        throw new ConvexError({
          code: "USER_ERROR",
          message: "Only the captain or first mates can change roles!",
        });
      }
      if (userCrewEntry?._id === memberId) {
        throw new ConvexError({
          code: "USER_ERROR",
          message: "You can't change your own role!",
        });
      }
      const targetMember = crew.find((c) => c._id === memberId);
      if (targetMember!.role === "captain") {
        throw new ConvexError({
          code: "USER_ERROR",
          message: "You can't change the role of the captain!",
        });
      }
      await db.patch(memberId, { role });
    });
  },
});
