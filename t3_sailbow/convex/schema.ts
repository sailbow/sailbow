import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    trips: defineTable({
        name: v.string(),
        slug: v.optional(v.string()),
        description: v.string(),
        captainUserId: v.string(),
        banner: v.optional(v.object({
            alt: v.string(),
            thumbnail: v.string(),
            small: v.string(),
            regular: v.string(),
            full: v.string(),
        }))
    }),
    crews: defineTable({
        boatId: v.id("trips"),
        userId: v.string(),
        email: v.string(),
        role: v.union(
            v.literal("captain"),
            v.literal("firstMate"),
            v.literal("crewMember")
        )
    })
})