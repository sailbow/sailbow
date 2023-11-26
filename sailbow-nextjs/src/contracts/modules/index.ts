import { InferRequestType, InferResponseType, RequestResponseContract } from "@/contracts"
import { moduleSettings, modules } from "@/server/db/schema"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

const dateModuleOptionSchema = z.object({
	type: z.literal("date"),
	start: z.date(),
	end: z.date().nullish()
})

const locationModuleOptionSchema = z.object({
	type: z.literal("location"),
	address: z.string()
})

const moduleDataSchemas = z.discriminatedUnion("type", [
	dateModuleOptionSchema,
	locationModuleOptionSchema
])

type ModuleType = z.infer<typeof moduleDataSchemas>[typeof moduleDataSchemas.discriminator]

export const AddModuleContract = {
    requestSchema: createInsertSchema(modules)
        .omit({ id: true, authorId: true, finalizedOptionId: true, createdOn: true})
        .extend({
            type: z.custom<ModuleType>(),
            settings: createInsertSchema(moduleSettings)
                .omit({ moduleId: true })
        }),
    responseSchema: z.object({ moduleId: z.number() })
} satisfies RequestResponseContract

export type AddModuleRequest = InferRequestType<typeof AddModuleContract>
export type AddModuleResponse = InferResponseType<typeof AddModuleContract>