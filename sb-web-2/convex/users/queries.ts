import { query } from "../_generated/server";
import { ConvexError } from "convex/values";

export const me = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError({
      code: "UNAUTHENTICATED"
    });

    return await ctx.db.query("users")
      .withIndex("by_externalId", q => q.eq("externalId", user.tokenIdentifier.slice(user.tokenIdentifier.indexOf("|") + 1)))
      .unique();
  }
})