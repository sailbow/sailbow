/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as lib from "../lib.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  lib: typeof lib;
}>;
export type Mounts = {
  lib: {
    add: FunctionReference<
      "mutation",
      "public",
      {
        allowMultipleReactions?: boolean;
        label: string;
        namespace?: string;
        targetId: string;
        userId: string;
      },
      null
    >;
    deleteAllForTarget: FunctionReference<
      "mutation",
      "public",
      { namespace?: string; targetId: string },
      null
    >;
    getBatchCounts: FunctionReference<
      "query",
      "public",
      { targets: Array<{ namespace?: string; targetId: string }> },
      Array<{
        counts: Array<{ count: number; label: string }>;
        namespace?: string;
        targetId: string;
      }>
    >;
    getCounts: FunctionReference<
      "query",
      "public",
      { namespace?: string; targetId: string },
      Array<{ count: number; label: string }>
    >;
    getUserReactions: FunctionReference<
      "query",
      "public",
      { namespace?: string; targetId: string; userId: string },
      Array<string>
    >;
    hasUserReacted: FunctionReference<
      "query",
      "public",
      { label: string; namespace?: string; targetId: string; userId: string },
      boolean
    >;
    list: FunctionReference<
      "query",
      "public",
      { namespace?: string; targetId: string },
      Array<{
        _creationTime: number;
        _id: string;
        label: string;
        namespace?: string;
        targetId: string;
        userId: string;
      }>
    >;
    remove: FunctionReference<
      "mutation",
      "public",
      { label: string; namespace?: string; targetId: string; userId: string },
      null
    >;
  };
};
// For now fullApiWithMounts is only fullApi which provides
// jump-to-definition in component client code.
// Use Mounts for the same type without the inference.
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
