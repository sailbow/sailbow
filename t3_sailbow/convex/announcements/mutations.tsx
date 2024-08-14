import { mutation } from "@convex/_generated/server";
import { withUser } from "@convex/authUtils";
import { announcementSchema } from "@convex/schema";
import { throwIfNotMember } from "@convex/tripUtils";

export const create = mutation({
  args: announcementSchema,
  handler: async ({ db, auth }, args) => {
    return await withUser(auth, async (user) => {
      await throwIfNotMember(user, args.tripId, db);
      console.log(user.tokenIdentifier);
      const userId = await db
        .query("users")
        .withIndex("by_externalId", (q) =>
          q.eq(
            "externalId",
            user.tokenIdentifier.slice(user.tokenIdentifier.indexOf("|") + 1),
          ),
        )
        .unique();
      console.log(userId);
      await db.insert("announcements", { ...args, createdBy: userId?._id! });
    });
  },
});
