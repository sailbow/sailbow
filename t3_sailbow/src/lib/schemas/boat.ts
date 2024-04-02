import { z } from "zod";
import { type boats } from "@/server/db/schema";
import { type InferSelectModel } from "drizzle-orm";

const colorBannerSchema = z.object({
    bannerType: z.literal("color"),
    bannerValue: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Invalid color value")
})

const imageBannerSchema = z.object({
    bannerType: z.literal("url"),
    bannerValue: z.string().url("Invalid image url")
})

export const bannerSchema = z.discriminatedUnion("bannerType", [
    colorBannerSchema,
    imageBannerSchema,
])

export const createBoatSchema = z
    . object({
        name: z.string().min(1, "Name cannot be empty"),
        description: z.string().nullable(),
        crewInvites: z.array(z.object({
            emailAddress: z.string().email(),
            role: z.enum([ "captain", "firstMate", "crewMember"])
        }))
    })
    .and(bannerSchema)


export type CreateBoat = z.infer<typeof createBoatSchema>
export type Boat = InferSelectModel<typeof boats>

export type BoatBanner = z.infer<typeof bannerSchema>
export type BoatBannerType = BoatBanner["bannerType"]