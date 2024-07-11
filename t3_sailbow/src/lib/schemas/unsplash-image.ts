import { z } from "zod";

export const unsplashImageSchema = z.object({
    id: z.string().min(1),
    width: z.number().min(1),
    height: z.number().min(1),
    alt_description: z.string().min(1),
    user: z.object({ name: z.string() }).nullish(),
    urls: z.object({
        raw: z.string().url(),
        full: z.string().url(),
        regular: z.string().url(),
        small: z.string().url(),
        thumb: z.string().url()
    })
})

export type UnsplashImage = z.infer<typeof unsplashImageSchema>