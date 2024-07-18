"use client";

import { useQuery } from "convex/react";
import { type FunctionReference } from "convex/server";
import { useMemo } from "react";

export function useConvexQuery<Query extends FunctionReference<"query">>(query: Query, args: Query["_args"]) {
    const data = useQuery(query, args);

    const result = useMemo(() => {
        return {
            isLoading: data !== undefined,
            data: data ?? null
        }
    }, [data]);

    return result;
}