import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { env } from "@/env";
import { TRPCError } from "@trpc/server"
import { z } from "zod"

const searchResponseSchema = z.object({
    total: z.number(),
    total_pages: z.number(),
    results: z.array(z.object({
        id: z.string().min(1),
        width: z.number().min(1),
        height: z.number().min(1),
        alt_description: z.string().min(1),
        urls: z.object({
            raw: z.string().url(),
            full: z.string().url(),
            regular: z.string().url(),
            small: z.string().url(),
            thumb: z.string().url()
        })
    })
)});
type ImageSearchResponse = z.infer<typeof searchResponseSchema>

export const imagesRouter = createTRPCRouter({
    search: protectedProcedure
        .input(z.object({
            query: z.coerce.string().min(1).transform(q => q.trim()),
            page: z.coerce.number().min(1).default(1).optional(),
            perPage: z.coerce.number().min(1).default(25).optional(),
            orientation: z.enum([ "portrait", "landscape", "squarish" ]).default("landscape").optional()
        }))
        .query(async ({ input }) => {
            const url = new URL("https://api.unsplash.com/search/photos")
            url.searchParams.set("client_id", env.UNSPLASH_API_KEY)
            url.searchParams.set("query", input.query)
            input.page && url.searchParams.set("page", input.page.toString())
            input.perPage && url.searchParams.set("per_page", input.perPage.toString())
            input.orientation && url.searchParams.set("orientation", input.orientation)

            const res = await fetch(url)
            if (!res.ok) {
                throw new TRPCError({
                    code: "UNPROCESSABLE_CONTENT",
                    message: "Invalid response received from Unsplash",
                    cause: await res.text()
                })
            }
            const data: ImageSearchResponse = searchResponseSchema.parse(await res.json());
            return data.results;
        })
})