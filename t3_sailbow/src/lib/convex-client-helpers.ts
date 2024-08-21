"use client";

import { useMutation, useQuery } from "convex/react";
import { type FunctionReference } from "convex/server";
import { ConvexError, Value } from "convex/values";
import { useEffect, useMemo, useState } from "react";

export function useConvexQuery<Query extends FunctionReference<"query">>(query: Query, args: Query["_args"]) {
    const data = useQuery(query, args);

    const result = useMemo(() => {
        return {
            isLoading: data === undefined,
            data: data ?? null
        }
    }, [data]);

    return result;
}

export function useConvexMutation<Mutation extends FunctionReference<"mutation">>(
    mutation: Mutation,
    opts?: {
        onSuccess?: (result: Mutation["_returnType"]) =>  void, 
        onError?: (error: Error) => void
    } | undefined
) {
    const mutationFn = useMutation(mutation);
    const [isLoading, setIsLoading] = useState(false);
    const mutate = async (args: Mutation["_args"]) => {
        setIsLoading(true);
        try {
            const result = await mutationFn(args);
            if (opts?.onSuccess !== undefined) {
                opts.onSuccess(result);
            }
        } catch (error) {
            if (opts?.onError !== undefined) {
                opts.onError(error as Error);
            }
        } finally {
            setIsLoading(false);
        }
    }

    return { mutate, isLoading };
}