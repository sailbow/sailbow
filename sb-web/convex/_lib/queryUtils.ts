import { z, ZodUndefined, type ZodTypeAny } from "zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { zCustomQuery } from "convex-helpers/server/zod";
import { query } from "../_generated/server";
import { type Value } from "convex/values";

export const zodQuery = zCustomQuery(query, NoOp);

const errorSchema  = z.discriminatedUnion("code", [
  z.object({ code: z.literal("NOT_FOUND")}),
  z.object({ code: z.literal("BAD_REQUEST"), message: z.string()})
]);

type ErrorData = z.infer<typeof errorSchema>

export const outputSchema = <Output extends ZodTypeAny>(output: Output) => {
  return z.union([
    z.object({
      error: errorSchema
    }),
    z.object({
      data: output,
    })
  ]);
}

export type SuccessfulResult<TData extends Exclude<Value, null>> = { error: null, data: TData };
type ErrorResult = { data: null, error: z.infer<typeof errorSchema> }
type Result<TData extends Exclude<Value,null>> =
| SuccessfulResult<TData>
| ErrorResult

export const notFound = (): ErrorResult => ({ data: null, error: { code: "NOT_FOUND" } })
export const badRequest = (message: string): ErrorResult => ({ data: null, error: { code: "BAD_REQUEST", message}});

export const success = <TData extends NonNullable<Value>> (data: TData) => ({
  data: data,
  error: null
})

export const valueOrNotFound = <TValue extends Value>(value: TValue) => {
  if (!value) {
    return notFound();
  }
}