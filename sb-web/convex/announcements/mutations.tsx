import { mutation } from "../_generated/server";
import { withUser } from "../authUtils";
import { announcementSchema } from "../schema";
import { throwIfNotMember } from "../tripUtils";

export const create = mutation({
  args: announcementSchema,
  handler: async ({ db, auth }, args) => {
    return await withUser(auth, db, async (user) => {
      await throwIfNotMember(user, args.tripId, db);
      await db.insert("announcements", { ...args, createdBy: user.userId });
    });
  },
});
