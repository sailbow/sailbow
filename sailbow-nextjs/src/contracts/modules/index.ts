import { InferRequestType, InferResponseType, RequestContract, RequestResponseContract } from "@/contracts"
import { moduleOptions, moduleSettings, modules } from "@/server/db/schema"
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

const moduleOptionSchemas = z.discriminatedUnion("type", [
	dateModuleOptionSchema,
	locationModuleOptionSchema
])

type ModuleType = z.infer<typeof moduleOptionSchemas>[typeof moduleOptionSchemas.discriminator]
type ModuleOption = z.infer<typeof moduleOptionSchemas>

export const UpdateModuleSettings = {
    requestSchema: createInsertSchema(moduleSettings)
} satisfies RequestContract

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

export const AddModuleOption = {
    requestSchema: createInsertSchema(moduleOptions)
        .and(z.object({ moduleId: z.number() })),
    responseSchema: z.object({ moduleOptionId: z.number() })
} satisfies RequestResponseContract

export const DeleteModuleOption = {
    requestSchema: z.object({ moduleOptionId: z.number() })
} satisfies RequestContract

export const UpdateModuleOption = {
    requestSchema: createInsertSchema(moduleOptions)
        .and(z.object({ moduleOptionId: z.number() }))
}

export type AddModuleRequest = InferRequestType<typeof AddModuleContract>
export type AddModuleResponse = InferResponseType<typeof AddModuleContract>