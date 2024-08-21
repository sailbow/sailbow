import { action } from "@convex/_generated/server";
import { ConvexError, v } from "convex/values";
import { z } from "zod";

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

export const search = action({
  args: {
    page: v.number(),
    query: v.string(),
  },
  returns: v.array(v.object({
    id: v.string(),
    width: v.number(),
    height: v.number(),
    alt_description: v.string(),
    urls: v.object({
      raw: v.string(),
      full: v.string(),
      regular: v.string(),
      small: v.string(),
      thumb: v.string()
    })
  })),
  handler: async ({ auth }, args) => {
    const user = await auth.getUserIdentity();
    if (!user) throw new ConvexError("Not signed in");
    const url = new URL("https://api.unsplash.com/search/photos")
    url.searchParams.set("client_id", process.env.UNSPLASH_API_KEY!)
    url.searchParams.set("query", args.query)
    url.searchParams.set("page", args.page.toString())
    url.searchParams.set("per_page", "25")
    url.searchParams.set("orientation", "landscape");

    const res = await fetch(url)
    if (!res.ok) {
        throw new ConvexError("Invalid response received from Unsplash");
    }
    const data: ImageSearchResponse = searchResponseSchema.parse(await res.json());
    return data.results;
  }
});