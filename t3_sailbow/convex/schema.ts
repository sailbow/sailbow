import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const tripSchema = {
    name: v.string(),
    slug: v.optional(v.string()),
    description: v.string(),
    banner: v.union(
        v.null(),
        v.object({
            alt: v.string(),
            thumbnail: v.string(),
            small: v.string(),
            regular: v.string(),
            full: v.string(),
        })
    ),
}

export const crewMemberSchema = {
    tripId: v.id("trips"),
    userId: v.optional(v.string()),
    email: v.string(),
    role: v.union(
        v.literal("captain"),
        v.literal("firstMate"),
        v.literal("crewMember")
    )
}

export default defineSchema({
    trips: defineTable(tripSchema)
        .searchIndex("search_trip_name", {
            searchField: "name",
        }),
    crews: defineTable(crewMemberSchema)
        .index("by_userId", ["userId"])
        .index("by_userId_and_tripId", ["userId", "tripId"])
        .index("by_tripId", ["tripId"])
        .index("by_email", ["email"])
})