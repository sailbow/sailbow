import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { boatBanners, boats } from "@/server/db/schema";
import { z, type ZodType } from "zod";

type RequestContract = { requestSchema: ZodType }

type ResponseContract = { responseSchema: ZodType }

type RequestResponseContract = RequestContract & ResponseContract

export type InferRequestType<T extends RequestContract> = z.infer<T["requestSchema"]>
export type InferResponseType<T extends ResponseContract> = z.infer<T["responseSchema"]>

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