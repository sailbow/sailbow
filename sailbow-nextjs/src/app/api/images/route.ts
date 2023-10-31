import { NextRequest, NextResponse } from 'next/server'
import { serverEnv } from '@/env.mjs'
import z from 'zod'
import { urlSearchParamsToObject } from '../_common'

const searchSchema = z.object({
    query: z.coerce.string().min(1).transform(q => q.trim()),
    page: z.coerce.number().min(1).default(1).optional(),
    perPage: z.coerce.number().min(1).default(25).optional(),
    orientation: z.enum([ "portrait", "landscape", "squarish" ]).default("landscape").optional()
})

async function Search(req: NextRequest): Promise<NextResponse> {
    const params = urlSearchParamsToObject(req.nextUrl.searchParams)
    const parseSearchResult = searchSchema.safeParse(params)
    if (!parseSearchResult.success) {
        return NextResponse.json(parseSearchResult.error, { status: 400 })
    }
    const q = {  ...parseSearchResult.data }
    const url = new URL("https://api.unsplash.com/search/photos")
    url.searchParams.set("client_id", serverEnv.UNSPLASH_API_KEY)
    url.searchParams.set("query", q.query)
    q.page && url.searchParams.set("page", q.page.toString())
    q.perPage && url.searchParams.set("per_page", q.perPage.toString())
    q.orientation && url.searchParams.set("orientation", q.orientation)

    const res = await fetch(url)
    if (!res.ok) {
        return NextResponse.json(await res.json(), { status: res.status })
    }
    return NextResponse.json(await res.json())
}

export { Search as GET }