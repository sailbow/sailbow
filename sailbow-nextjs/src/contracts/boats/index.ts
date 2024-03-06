import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { boats, boatBanners, crewMembers, modules } from "@/server/db/schema";

const boatBannerSchema = createSelectSchema(boatBanners);
const boatSchema = createSelectSchema(boats).extend({
    banner: boatBannerSchema
});
const crewMemberSchema = createSelectSchema(crewMembers);
const createBoatSchema = createInsertSchema(boats).extend({
    banner: createInsertSchema(boatBanners)
        .omit({ boatId: true })
});
const extendedBoatSchema = boatSchema.extend({
    banner: boatBannerSchema,
    captain: crewMemberSchema,
    crew: z.array(crewMemberSchema).default([]),
    modules: z.array(createSelectSchema(modules)).default([])
});

export type Boat = z.infer<typeof boatSchema>
export type BoatExtended = z.infer<typeof extendedBoatSchema>
export type BoatBanner = z.infer<typeof boatBannerSchema>
export type CrewMember = z.infer<typeof crewMemberSchema>

export type CreateBoat = z.infer<typeof createBoatSchema>