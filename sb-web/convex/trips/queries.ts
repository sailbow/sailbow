import { type Doc, type DataModel, type Id } from "../_generated/dataModel";
import { query } from "../_generated/server";
import { withUser } from "../authUtils";
import { SbError } from "../errorUtils";
import { asyncMap, pruneNull } from "convex-helpers";
import { getOneFrom } from "convex-helpers/server/relationships";
import { type GenericDatabaseReader } from "convex/server";
import { v } from "convex/values";
import { throwIfNotMember } from "../tripUtils";

const getMemberships = async ({
  user,
  db,
}: {
  user: { userId: Id<"users"> };
  db: GenericDatabaseReader<DataModel>;
}) => {
  return await db
    .query("crews")
    .withIndex("by_userId", (q) => q.eq("userId", user.userId))
    .collect();
};

const getCrewCount = async (
  db: GenericDatabaseReader<DataModel>,
  tripId: Id<"trips">,
) => {
  return (
    await db
      .query("crews")
      .withIndex("by_tripId", (q) => q.eq("tripId", tripId))
      .collect()
  ).length;
};

export const getById = query({
  args: {
    tripId: v.id("trips"),
  },
  handler: async ({ db, auth }, { tripId }) => {
    return await withUser(auth, db, async (user) => {
      await throwIfNotMember(user, tripId, db);

      const trip = await getOneFrom(db, "trips", "by_id", tripId, "_id");
      if (!trip) return null;
      return {
        ...trip,
        crewCount: await getCrewCount(db, tripId),
      };
    });
  },
});

export const getUserTrips = query({
  handler: async ({ db, auth }) => {
    return await withUser(auth, db, async (user) => {
      const memberships = await getMemberships({ user, db });
      const trips = await asyncMap(memberships, async (cm) => {
        const trip = await db.get(cm.tripId);
        if (!trip) return null;
        return {
          ...trip,
          crewCount: await getCrewCount(db, trip._id),
        };
      });

      return pruneNull(trips);
    });
  },
});

export const getTripCrew = query({
  args: {
    tripId: v.id("trips"),
  },
  handler: async ({ db, auth }, args) => {
    return await withUser(auth, db, async (user) => {
      const memberships = await getMemberships({ user, db });
      const trip = memberships.filter((m) => m.tripId === args.tripId)[0];
      if (!trip) throw new SbError({ code: "NOT_FOUND" });

      const crewRecords = await db
        .query("crews")
        .withIndex("by_tripId", (q) => q.eq("tripId", args.tripId))
        .collect();

      const userRecords = pruneNull(
        await Promise.all(
          crewRecords.map(async (cm) => {
            return await db
              .query("users")
              .withIndex("by_email", (q) => q.eq("email", cm.email))
              .unique();
          }),
        ),
      );

      return pruneNull(
        crewRecords.map((cm) => {
          const user = userRecords.find((u) => u.email == cm.email);
          if (!user) return null;
          return {
            ...cm,
            imageUrl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName,
          };
        }),
      );
    });
  },
});

export const searchTrips = query({
  args: {
    text: v.string(),
  },
  handler: async ({ db, auth }, { text }) => {
    return await withUser(auth, db, async (user) => {
      const memberships = (await getMemberships({ user, db })).sort(
        (a, b) => b._creationTime - a._creationTime,
      );
      if (!text) {
        return pruneNull(
          await asyncMap(
            memberships.sort((a, b) => b._creationTime - a._creationTime),
            async (membership) => {
              return await db
                .query("trips")
                .withIndex("by_id", (q) => q.eq("_id", membership.tripId))
                .unique();
            },
          ),
        );
      }
      const trips = pruneNull(
        await asyncMap(
          memberships,
          async (m) =>
            await db
              .query("trips")
              .withSearchIndex("search_trip_name", (q) =>
                q.search("name", text),
              )
              .filter((q) => q.eq(q.field("_id"), m.tripId))
              .unique(),
        ),
      );
      return trips;
    });
  },
});
