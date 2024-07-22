import { Id, type DataModel } from "@convex/_generated/dataModel";
import { MutationCtx, query, QueryCtx } from "@convex/_generated/server";
import { getUser, queryWithAuth, withAuth, withUser } from "@convex/authUtils";
import { SbError } from "@convex/errorUtils";
import { asyncMap, pruneNull } from "convex-helpers";
import { getOneFromOrThrow, getManyFrom, getOneFrom } from "convex-helpers/server/relationships";
import { type GenericDatabaseReader, type UserIdentity } from "convex/server";
import { ConvexError, v } from "convex/values";

const getMemberships = async ({ user, db }: { user: UserIdentity, db: GenericDatabaseReader<DataModel>}) => {
  return await db
    .query("crews")
    .filter(q => q.and(
      q.or(
        q.eq(q.field("userId"), user.tokenIdentifier),
        q.eq(q.field("email"), user.email)
      ),
    ))
    .collect();
}

export const getById = query({
  args: {
    tripId: v.id("trips"),
  },
  handler: async ({ db, auth }, { tripId }) => {
    return await withUser(auth, async (user) => {
      const membership = await db
        .query("crews")
        .withIndex("by_tripId", q => q.eq("tripId", tripId))
        .filter(q => q.or(
          q.eq(q.field("userId"), user.tokenIdentifier),
          q.eq(q.field("email"), user.email)
        ))
        .first();
        
      if (!membership) return null;
      return await getOneFrom(db, "trips", "by_id", membership.tripId, "_id");
    })
  }
})

export const getUserTrips = query({
  handler: withAuth(async ({ db, user }) => {
    const memberships = await getMemberships({ user, db });
    const trips = (await asyncMap(
      memberships,
      (cm) => db.get(cm.tripId)
    ))

    return pruneNull(trips);
  })
});

export const getTripCrew = query({
  args: {
    tripId: v.id("trips")
  },
  handler: async ({ db, auth }, args) => {
    return await withUser(auth, async (user) => {
      const memberships = await getMemberships({ user, db })
      const trip = memberships.filter(m => m.tripId === args.tripId)[0];
      if (!trip) throw new SbError({ code: "NOT_FOUND" });
      
      return await db
        .query("crews")
        .withIndex("by_tripId", q => q.eq("tripId", args.tripId))
        .collect();
    });
  }
})

export const searchTrips = query({
  args: {
    text: v.string()
  },
  handler: async ({ db, auth }, { text }) => {
    return await withUser(auth, async (user) => {
      const memberships = await getMemberships({ user, db });
      const trips = pruneNull(await asyncMap(
        memberships,
        async (m) => await db.query("trips")
        .withSearchIndex("search_trip_name", q => q.search("name", text))
        .filter(q => q.eq(q.field("_id"), m.tripId))
        .unique()
      ));
      return trips;
    })
  }
})