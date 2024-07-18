import { type DataModel } from "@convex/_generated/dataModel";
import { MutationCtx, query, QueryCtx } from "@convex/_generated/server";
import { getUser } from "@convex/authUtils";
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
export const getTripById = query({
  args: {
    tripId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx.auth);
    const membership = await ctx.db
      .query("crews")
      .filter(q => q.and(
        q.or(
          q.eq(q.field("userId"), user.tokenIdentifier),
          q.eq(q.field("email"), user.email)
        ),
        q.eq(q.field("tripId"), args.tripId)
      ))
      .first();
    if (!membership) throw new ConvexError("NOT_FOUND");
    return await getOneFromOrThrow(ctx.db, "trips", "by_id", membership.tripId, "_id");
  }
});

export const getUserTrips = query({
  handler: async ({ db, auth }) => {
    const user = await getUser(auth);

    const trips = (await asyncMap(
      await getManyFrom(db, "crews", "by_userId", user.tokenIdentifier),
      (cm) => db.get(cm.tripId)
    ))

    return pruneNull(trips);
  }
});

export const getTripCrew = query({
  args: {
    tripId: v.id("trips")
  },
  handler: async ({ db, auth }, args) => {
    const user = await getUser(auth);
    const memberships = await getMemberships({ user, db })
    const trip = memberships.filter(m => m.tripId === args.tripId)[0];
    if (!trip) throw new SbError({ code: "NOT_FOUND" });
    
    return await db
      .query("crews")
      .withIndex("by_tripId", q => q.eq("tripId", args.tripId))
      .collect();
  }
})