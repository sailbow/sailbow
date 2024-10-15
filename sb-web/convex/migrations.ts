/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { makeMigration, startMigrationsSerially } from "convex-helpers/server/migrations";
import { internalMutation } from "./_generated/server";
import { getOneFrom } from "convex-helpers/server/relationships";
import { internal } from "./_generated/api";

const migration = makeMigration(internalMutation, {
  migrationTable: "migrations",
});

export const crewUserIdRequireMigration = migration({
  table: "crews",
  migrateOne: async (ctx, doc) => {
    const user = await getOneFrom(ctx.db, "users", "by_email", doc.email.toLowerCase());
    if (!user) {
      await ctx.db.delete(doc._id);
      return;
    } else {
      return { userId: user._id, email: doc.email.toLowerCase() }
    }
  }
});

export default internalMutation(async (ctx) => {
  await startMigrationsSerially(ctx, [
    internal.migrations.crewUserIdRequireMigration,
  ])
});
