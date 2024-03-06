import { AddModuleContract, AddModuleOption, UpdateModuleSettings } from "@/contracts/modules";
import { captainMiddleware, createTRPCRouter, protectedBoatProcedure } from "../trpc";
import { InferInsertModel, eq } from "drizzle-orm";
import { ModuleSettings, moduleOptionVotes, moduleOptions, moduleSettings, modules } from "@/server/db/schema";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const modulesRouter = createTRPCRouter({
    addModule: protectedBoatProcedure
        .input(AddModuleContract.requestSchema)
        .output(AddModuleContract.responseSchema)
        .mutation(async ({ input, ctx }) => {
            const m: InferInsertModel<typeof modules> = {
                ...input,
                authorId: ctx.auth.userId
            }
            return await ctx.db.transaction(async (tx) => {
                const insertResult = await tx.insert(modules).values(m)
                const moduleId = parseInt(insertResult.insertId)
                const settings: InferInsertModel<typeof moduleSettings> = {
                    ...input.settings,
                    moduleId
                }
                await tx.insert(moduleSettings).values(settings)
                return { moduleId }
            })
        }),
    updateModuleSettings: protectedBoatProcedure
        .use(captainMiddleware)
        .input(UpdateModuleSettings.requestSchema)
        .mutation(async ({ input, ctx }) => {
            await ctx.db
                .update(moduleSettings)
                .set(input)
                .where(eq(moduleSettings.moduleId, input.moduleId))
        }),
    deleteModule: protectedBoatProcedure
        .use(captainMiddleware)
        .input(z.object({ moduleId: z.number() }))
        .mutation(async ({ input, ctx }) => {
            await ctx.db
                .delete(modules)
                .where(eq(modules.id, input.moduleId))
        }),
    // addModuleOption: protectedBoatProcedure
    //     .input(AddModuleOption.requestSchema)
    //     .output(AddModuleOption.responseSchema)
    //     .mutation(async ({ input, ctx }) => {
    //         const mod = await ctx.db.query.modules.findFirst({
    //             where: eq(modules.id, input.moduleId)
    //         })
    //         if (!mod) {
    //             throw new TRPCError({ code: "NOT_FOUND" })
    //         }
    //         if (mod.type !== input.data.type) {
    //             throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid module type" })
    //         }
    //         return await ctx.db.transaction(async (tx) => {
    //             const insertResult = await tx.insert(moduleOptions).values(input)
    //         })
    //     })
})