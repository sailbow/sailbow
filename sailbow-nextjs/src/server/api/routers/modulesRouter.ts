import { AddModuleContract } from "@/contracts/modules";
import { captainMiddleware, createTRPCRouter, protectedBoatProcedure } from "../trpc";
import { InferInsertModel, eq } from "drizzle-orm";
import { moduleOptionVotes, moduleSettings, modules } from "@/server/db/schema";
import { z } from "zod";

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

    deleteModule: protectedBoatProcedure
        .use(captainMiddleware)
        .input(z.object({ moduleId: z.number() }))
        .mutation(async ({ input, ctx }) => {
            await ctx.db.delete(modules).where(eq(modules.id, input.moduleId))
        })
})