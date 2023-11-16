import { boats, boatBanners, crewMembers } from "@/server/db/schema"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { type RequestResponseContract, type ResponseContract } from "@/contracts"
import { SendInvitationContract } from "@/contracts/invites"

export const CreateBoatContract = {
    requestSchema: createInsertSchema(boats)
        .omit({ id: true, captainUserId: true, createdOn: true })
        .extend({
            banner: createInsertSchema(boatBanners).omit({ boatId: true }),
            crewInvites: z.array(SendInvitationContract.requestSchema
                .omit({ boatId: true }))
                .default([])
        }),
    responseSchema: z.object({ boatId: z.number() })
} satisfies RequestResponseContract

export const GetBoatsContract = {
    responseSchema: z.array(
        createSelectSchema(boats).extend({ banner: createSelectSchema(boatBanners)})
    )
} satisfies ResponseContract

export const GetBoatByIdContract = {
    requestSchema: z.object({
        boatId: z.number().min(1),
        includeCrew: z.boolean().default(false),
        includeBanner: z.boolean().default(false)
    }),
    responseSchema: createSelectSchema(boats)
        .extend({
            banner: createSelectSchema(boatBanners).nullish(),
            crew: z.array(createSelectSchema(crewMembers)).nullish()
        })
}