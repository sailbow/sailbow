import { v } from "convex/values";
import { internalQuery } from "../_generated/server";
import { getMemberships } from "../tripUtils";
import { asyncMap } from "convex-helpers";

export const getDetailedTripsByEmail = internalQuery({
  args: { email: v.string() },
  handler: async ({ db }, { email }) => {
    const memberships = await db.query("crews")
      .withIndex("by_email", q => q.eq("email", email))
      .collect();
    

    return await asyncMap(
      memberships,
      async (membership) => {
        const data = await Promise.all(
          [
            db.get(membership.tripId),
            db.query("crews")
              .withIndex("by_tripId", q => q.eq("tripId", membership.tripId))
              .collect(),
            db.query("itineraryItems")
              .withIndex("by_tripId", q => q.eq("tripId", membership.tripId))
              .collect(),
            db.query("announcements")
              .withIndex("by_tripId", q => q.eq("tripId", membership.tripId))
              .collect(),
            db.query("invitations")
              .withIndex("by_tripId", q => q.eq("tripId", membership.tripId))
              .collect()
          ]
        );
        return {
          trip: data[0],
          crew: data[1],
          itinerary: data[2],
          announcements: data[3],
          invitations: data[4]
        }
      }
    );
  }
})