import { z } from "zod";
import { type boats } from "@/server/db/schema";
import { type InferSelectModel } from "drizzle-orm";

export const bannerSchema = z.object({
    thumbnail: z.string().url(),
    small: z.string().url(),
    regular: z.string().url(),
    full: z.string().url(),
    alt: z.string()
}).nullable();

export const createBoatSchema = z
    . object({
        name: z.string().min(1, "Name cannot be empty"),
        description: z.string().default(""),
        banner: bannerSchema,
    })


export type CreateBoat = z.infer<typeof createBoatSchema>
export type Boat = InferSelectModel<typeof boats>

export type BoatBanner = z.infer<typeof bannerSchema>