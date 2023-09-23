import { publicProcedure, router } from "./trpc"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { createSelectSchema } from "drizzle-zod"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { users } from "@/db/schema"

export const appRouter = router({
    getUserById: publicProcedure
        .input(z.number().positive())
        .output(createSelectSchema(users).omit({ hash: true}))
        .query(async (opts) => {
            const user = await db.query.users.findFirst({
                where: eq(users.id, opts.input)
            })
            if (user == undefined) throw new TRPCError({ code: "NOT_FOUND" });
            return user
        }),
})

export type AppRouter = typeof appRouter;