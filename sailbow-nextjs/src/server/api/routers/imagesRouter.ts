import { SearchImagesContract } from "@/contracts/images"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { serverEnv } from "@/env.mjs"
import { TRPCError } from "@trpc/server"

export const imagesRouter = createTRPCRouter({
    search: protectedProcedure
        .input(SearchImagesContract.requestSchema)
        .output(SearchImagesContract.responseSchema)
        .query(async ({ input }) => {
            const url = new URL("https://api.unsplash.com/search/photos")
            url.searchParams.set("client_id", serverEnv.UNSPLASH_API_KEY)
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

            const data = await res.json()
            return data["results"]
        })
})