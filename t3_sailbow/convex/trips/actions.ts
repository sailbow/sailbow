import { api } from "@convex/_generated/api";
import { internalAction } from "@convex/_generated/server";
import { withUser } from "@convex/authUtils";
import { v } from "convex/values";
import {clerkClient, getPrimaryEmail} from "@convex/_lib/clerk";
import { type Doc } from "@convex/_generated/dataModel";

export const getCrew = internalAction({
  args: {
    tripId: v.id("trips")
  },
  handler: async ({ auth, runQuery }, args) => {
    return await withUser(auth, async () => {
      const crew: Doc<"crews">[] = await runQuery(api.trips.queries.getTripCrew, args);
      const users = (await clerkClient.users.getUserList({
        emailAddress: crew.map(m => m.email)
      })).data;
      return users.map(u => ({
        _id: crew.find(c => c.email === getPrimaryEmail(u))!._id,
        userId: u.id,
        firstName: u.firstName ?? "",
        lastName: u.lastName ?? "",
        imageUrl: u.imageUrl,
        email: getPrimaryEmail(u)
      }))
    });
  }
});