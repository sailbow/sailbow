import { mutation } from "@convex/_generated/server";
import { withUser } from "@convex/authUtils";
import { announcementSchema } from "@convex/schema";
import { throwIfNotMember } from "@convex/tripUtils";

export const create = mutation({
  args: announcementSchema,
  handler: async ({ db, auth }, args) => {
    return await withUser(auth, db, async (user) => {
      await throwIfNotMember(user, args.tripId, db);
      await db.insert("announcements", { ...args, createdBy: user.userId });
    });
  },
});
