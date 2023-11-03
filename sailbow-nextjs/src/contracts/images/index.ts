import { type RequestResponseContract } from "@/contracts"
import { z } from "zod"

// https://unsplash.com/documentation#search-photos
export const SearchImagesContract = {
    requestSchema: z.object({
        query: z.coerce.string().min(1).transform(q => q.trim()),
        page: z.coerce.number().min(1).default(1).optional(),
        perPage: z.coerce.number().min(1).default(25).optional(),
        orientation: z.enum([ "portrait", "landscape", "squarish" ]).default("landscape").optional()
    }),
    responseSchema: z.array(z.object({
        width: z.number().min(1),
        height: z.number().min(1),
        description: z.string(),
        urls: z.object({
            raw: z.string().url(),
            full: z.string().url(),
            regular: z.string().url(),
            small: z.string().url(),
            thumb: z.string().url()
        })
    }))
} satisfies RequestResponseContract