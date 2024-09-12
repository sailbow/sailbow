import { type GenericDatabaseReader, type UserIdentity } from "convex/server";
import { type Id, type DataModel } from "./_generated/dataModel";
import { ConvexError } from "convex/values";


export const getMemberships = async ({ user, db }: { user: UserIdentity, db: GenericDatabaseReader<DataModel>}) => {
  return await db
    .query("crews")
    .withIndex("by_email", q => q.eq("email", user.email!))
    .collect();
}

export const throwIfNotMember = async (user: UserIdentity, tripId: Id<"trips">, db: GenericDatabaseReader<DataModel>) => {
  const membership = await db.query("crews")
    .withIndex("by_email_and_tripId", q => q
      .eq("email", user.email!)
      .eq("tripId", tripId))
    .first();

  if (!membership) throw new ConvexError({
    code: "NOT_FOUND"
  });
  return membership;
}