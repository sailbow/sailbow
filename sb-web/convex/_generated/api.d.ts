/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as admin_queries from "../admin/queries.js";
import type * as announcements_mutations from "../announcements/mutations.js";
import type * as announcements_queries from "../announcements/queries.js";
import type * as authUtils from "../authUtils.js";
import type * as emails_tripInvite from "../emails/tripInvite.js";
import type * as errorUtils from "../errorUtils.js";
import type * as http from "../http.js";
import type * as images_actions from "../images/actions.js";
import type * as invitations_actions from "../invitations/actions.js";
import type * as invitations_mutations from "../invitations/mutations.js";
import type * as invitations_queries from "../invitations/queries.js";
import type * as itinerary_mutations from "../itinerary/mutations.js";
import type * as itinerary_queries from "../itinerary/queries.js";
import type * as itinerary_v2 from "../itinerary/v2.js";
import type * as lib_clerk from "../lib/clerk.js";
import type * as lib_queryUtils from "../lib/queryUtils.js";
import type * as lib_resend from "../lib/resend.js";
import type * as lib_tailwindConfig from "../lib/tailwindConfig.js";
import type * as lib_utils from "../lib/utils.js";
import type * as migrations from "../migrations.js";
import type * as notifications_mutations from "../notifications/mutations.js";
import type * as notifications_queries from "../notifications/queries.js";
import type * as polls from "../polls.js";
import type * as tripUtils from "../tripUtils.js";
import type * as trips_mutations from "../trips/mutations.js";
import type * as trips_queries from "../trips/queries.js";
import type * as users_mutations from "../users/mutations.js";
import type * as users_queries from "../users/queries.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "admin/queries": typeof admin_queries;
  "announcements/mutations": typeof announcements_mutations;
  "announcements/queries": typeof announcements_queries;
  authUtils: typeof authUtils;
  "emails/tripInvite": typeof emails_tripInvite;
  errorUtils: typeof errorUtils;
  http: typeof http;
  "images/actions": typeof images_actions;
  "invitations/actions": typeof invitations_actions;
  "invitations/mutations": typeof invitations_mutations;
  "invitations/queries": typeof invitations_queries;
  "itinerary/mutations": typeof itinerary_mutations;
  "itinerary/queries": typeof itinerary_queries;
  "itinerary/v2": typeof itinerary_v2;
  "lib/clerk": typeof lib_clerk;
  "lib/queryUtils": typeof lib_queryUtils;
  "lib/resend": typeof lib_resend;
  "lib/tailwindConfig": typeof lib_tailwindConfig;
  "lib/utils": typeof lib_utils;
  migrations: typeof migrations;
  "notifications/mutations": typeof notifications_mutations;
  "notifications/queries": typeof notifications_queries;
  polls: typeof polls;
  tripUtils: typeof tripUtils;
  "trips/mutations": typeof trips_mutations;
  "trips/queries": typeof trips_queries;
  "users/mutations": typeof users_mutations;
  "users/queries": typeof users_queries;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
