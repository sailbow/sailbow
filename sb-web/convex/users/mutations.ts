import { internalMutation } from "../_generated/server";
import { zodToConvex } from "convex-helpers/server/zod";
import { userSchema } from "../lib/clerk";

const upsertUserSchema = zodToConvex(userSchema);

export const upsertUser = internalMutation({
  args: upsertUserSchema,
  handler: async ({ db }, args) =>  {
    const user = {
      externalId: args.id,
      firstName: args.first_name,
      lastName: args.last_name,
      email: args.email_addresses.find(e => e.id === args.primary_email_address_id)!.email_address,
      imageUrl: args.image_url
    };
    const existingUser = await db
      .query("users")
      .withIndex("by_email", q => q.eq("email", user.email))
      .unique();

    if (!existingUser) {
      await db.insert("users", user);
    } else {
      await db.patch(existingUser._id, user);
    }
  }
})