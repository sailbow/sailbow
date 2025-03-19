import { type Id } from "@convex/_generated/dataModel";
import { z } from "zod";

export type PartialNullable<T> = { [K in keyof T]: T[K] | null };
export const ItinItemSchema = z.object({
  _id: z.custom<Id<"itineraryItems">>().optional(),
  tripId: z.custom<Id<"trips">>(),
  title: z.string(),
  start: z.string().datetime(),
  end: z.string().datetime(),
  location: z.string().nullable(),
  details: z.string().nullable().default(""),
});

export type ItinItem = z.infer<typeof ItinItemSchema>;
export type OptionalItinItem = PartialNullable<ItinItem> & {
  _id?: Id<"itineraryItems">;
};