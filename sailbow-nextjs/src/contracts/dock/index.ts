import { boats, boatBanners } from "@/server/db/schema"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { type RequestResponseContract, type ResponseContract } from "@/contracts"

export const CreateBoatContract = {
    requestSchema: createInsertSchema(boats)
        .omit({ id: true, captainUserId: true, createdOn: true })
        .extend({
            banner: createInsertSchema(boatBanners).omit({ boatId: true })
        }),
    responseSchema: z.object({ boatId: z.number() })
} satisfies RequestResponseContract

export const GetBoatsContract = {
    responseSchema: z.array(
        createSelectSchema(boats).extend({ banner: createSelectSchema(boatBanners)})
    )
} satisfies ResponseContract