
import { type QueryCtx} from "./_generated/server";
import { type UserIdentity, type Auth, type GenericDatabaseReader } from "convex/server";
import { ConvexError, PropertyValidators } from "convex/values";
import { type DataModel, type Id } from "./_generated/dataModel";
import { getOneFromOrThrow } from "convex-helpers/server/relationships";

export const getUser = async (auth: Auth) => {
  const user = await auth.getUserIdentity();
  if (!user) throw new ConvexError("User is not authenticated");
  return user;
}
/**
 * Wrapper for a Convex query or mutation function that provides a user in ctx.
 *
 * Throws an exception if there isn't a user logged in.
 * Pass this to `query`, `mutation`, or another wrapper. E.g.:
 * export default mutation({
 *   handler: withUser(async ({ db, auth, user }, {args}) => {...})
 * });
 * @param func - Your function that can now take in a `user` in the first param.
 * @returns A function to be passed to `query` or `mutation`.
 */
export const withAuth = <Ctx extends QueryCtx, Args extends [any] | [], Output>(
  func: (ctx: Ctx & { user: UserIdentity }, ...args: Args) => Promise<Output>
): ((ctx: Ctx, ...args: Args) => Promise<Output>) => {
  return async (ctx: Ctx, ...args: Args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error(
        "Unauthenticated call to function requiring authentication"
      );
    }
    return func({ ...ctx, user: { ...user, tokenIdentifier: user.tokenIdentifier.slice(user.tokenIdentifier.indexOf("|") + 1)} }, ...args);
  };
};

type UserCustomProps = {
  userId: Id<"users">
}
export const withUser = async <Output>(
  auth: Auth,
  db: GenericDatabaseReader<DataModel>,
  callback: (user: UserIdentity & UserCustomProps) => Promise<Output>) => {
  const user = await auth.getUserIdentity();
  if (!user) {
    throw new Error(
      "Unauthenticated call to function requiring authentication"
    );
  }
  const externalId = user.tokenIdentifier.slice(user.tokenIdentifier.indexOf("|") + 1);
  const dbUser = await getOneFromOrThrow(db, "users", "by_externalId", externalId);
  return await callback({...user, userId: dbUser._id });
}
