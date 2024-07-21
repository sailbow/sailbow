/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Allows you to look up the user generically and pass it into your functions.
 *
 * Modify this file to fit your user's table and index name, etc.
 *
 * The one caveat is if you're using `mutation(withUser(` on a raw function
 * (not wrapped in {handler: fn}), it fails to infer the ctx (db, etc.):
 *
 * ```
 * mutation(withUser(({db, user}) => {...})) // fails to infer that "db" is a DatabaseWriter
 * mutation(withUser({ handler: ({db, user}) => {...} })) // Works!
 * mutationWithUser({ handler: ({db, user}) => {...} })   // Works!
 * mutationWithUser(({db, user}) => {...})                // Works!
 * mutation(withUser(
 * ({db, user}: MutationCtx & {user: Doc<"users">} ) => {...}
 * ))                                                     // Works!
 * ```
 */
import { type MutationCtx, type QueryCtx, mutation, query } from "./_generated/server";
import { type UserIdentity, type Auth } from "convex/server";
import { ConvexError, PropertyValidators } from "convex/values";

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
    return func({ ...ctx, user }, ...args);
  };
};

export const withUser = async <Output>(
  auth: Auth,
  callback: (user: UserIdentity) => Promise<Output>) => {
  const user = await auth.getUserIdentity();
  if (!user) {
    throw new Error(
      "Unauthenticated call to function requiring authentication"
    );
  }
  return await callback(user);
}

/**
 * Wrapper for a Convex mutation function that provides a user in ctx.
 *
 * Note: if you want to use input validation, use `withUser` instead.
 * Throws an exception if there isn't a user logged in.
 * E.g.:
 * export default mutationWithUser(async ({ db, user }) => {...}));
 * @param func - Your function that can now take in a `user` in the ctx param.
 * @returns A Convex serverless function.
 */
export const mutationWithAuth = <Args extends [any] | [], Output>(
  func: (
    ctx: MutationCtx & { user: UserIdentity },
    ...args: Args
  ) => Promise<Output>
) => {
  return mutation(withAuth(func));
};

/**
 * Wrapper for a Convex query function that provides a user in ctx.
 *
 * Note: if you want to use input validation, use `withUser` instead.
 * Throws an exception if there isn't a user logged in.
 * E.g.:
 * export default queryWithUser(async ({ db, user }) => {...}));
 * @param func - Your function that can now take in a `user` in the ctx param.
 * @returns A Convex serverless function.
 */
export const queryWithAuth = <Args extends [any] | [], Output>(
  func: (
    ctx: QueryCtx & { user: UserIdentity }, 
    ...args: Args
  ) => Promise<Output>
) => {
  return query(withAuth(func));
};