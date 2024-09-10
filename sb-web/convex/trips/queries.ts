import { type Doc, type DataModel } from "../_generated/dataModel";
import { query } from "../_generated/server";
import { notFound, success, zodQuery } from "../lib/queryUtils";
import { withAuth, withUser } from "../authUtils";
import { SbError } from "../errorUtils";
import { asyncMap, pruneNull } from "convex-helpers";
import { getManyVia, getOneFrom } from "convex-helpers/server/relationships";
import { zid } from "convex-helpers/server/zod";
import { type GenericDatabaseReader, type UserIdentity } from "convex/server";
import { v } from "convex/values";

const getMemberships = async ({ user, db }: { user: UserIdentity, db: GenericDatabaseReader<DataModel>}) => {
  return await db
    .query("crews")
    .withIndex("by_email", q => q.eq("email", user.email!))
    .collect();
}

export const getById = query({
  args: {
    tripId: v.id("trips"),
  },
  handler: async ({ db, auth }, { tripId }) => {
    return await withUser(auth, db, async (user) => {
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
  handler: withAuth(async ({ db, user, }) => {
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
    return await withUser(auth, db, async (user) => {
      const memberships = await getMemberships({ user, db })
      const trip = memberships.filter(m => m.tripId === args.tripId)[0];
      if (!trip) throw new SbError({ code: "NOT_FOUND" });
      
      const crewRecords = await db
        .query("crews")
        .withIndex("by_tripId", q => q.eq("tripId", args.tripId))
        .collect();
      
      const userRecords = pruneNull(await Promise.all(crewRecords.map(async cm => {
        return await db.query("users")
          .withIndex("by_email", q => q.eq("email", cm.email))
          .unique();
      })));
      
      return pruneNull(crewRecords.map(cm => {
        const user = userRecords.find(u => u.email == cm.email);
        if (!user) return null;
        return {
          ...cm,
          imageUrl: user.imageUrl,
          firstName: user.firstName,
          lastName: user.lastName
        };
      }));
    });
  }
})

export const searchTrips = query({
  args: {
    text: v.string()
  },
  handler: async ({ db, auth }, { text }) => {
    return await withUser(auth, db, async (user) => {
      const memberships = await getMemberships({ user, db });
      if (!text) {
        let num = 0;
        const membs = [] as Doc<"crews">[];
        for (const m of memberships) {
          if (num >= 5) break;
          membs.push(m);
          num++;
        }
        return pruneNull(await asyncMap(
          membs,
          async (membership) => {
            return db.query("trips")
              .withIndex("by_id", q => q.eq("_id", membership.tripId))
              .unique()
          }
        ))
      }
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

export const getByIdTest = zodQuery({
  args: { tripId: zid("trips")},
  handler: async ({ db, auth }, { tripId }) => {
    return await withUser(auth, db, async (user) => {
      const membership = await db
        .query("crews")
        .withIndex("by_tripId", q => q.eq("tripId", tripId))
        .filter(q => q.or(
          q.eq(q.field("userId"), user.tokenIdentifier),
          q.eq(q.field("email"), user.email)
        ))
        .first();

      if (!membership) return notFound();
      const trip = await getOneFrom(db, "trips", "by_id", membership.tripId, "_id");
      if (!trip) return notFound();
      return success(trip);
    })
  }
})