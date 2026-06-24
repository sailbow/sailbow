import {
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import {
  query as baseQuery,
  mutation as baseMutation,
} from "../_generated/server";
import { DataModel } from "../_generated/dataModel";
import schema from "../schema";

import { createQueryFacade, QueryFacade } from "@davidtkramer/convex-relations";
import { DbReader, DbWriter } from "../dbUtils";

export const query = customQuery(
  baseQuery,
  customCtx((ctx: { db: DbReader }) => ({
    q: createQueryFacade<DataModel>(ctx.db, schema),
  })),
);

export const mutation = customMutation(
  baseMutation,
  customCtx((ctx: { db: DbReader }) => ({
    q: createQueryFacade<DataModel>(ctx.db, schema),
  })),
);

export type FluentQuery = QueryFacade<DataModel>;
