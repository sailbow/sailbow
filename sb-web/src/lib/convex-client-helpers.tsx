import { FunctionReference } from "convex/server";
import { useQuery, useMutation } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import useDebounce from "./use-debounce";

export type QArgs<TQuery extends FunctionReference<"query", "public">> = {
  query: TQuery;
  args: TQuery["_args"];
  enabled?: boolean | undefined;
  debounce?: number | undefined;
};

export const useQ = <TQuery extends FunctionReference<"query", "public">>(
  args: QArgs<TQuery>,
) => {
  const { isLoading, ...rest } = useQuery({
    ...convexQuery(args.query, args.args),
    enabled: args.enabled ?? true,
  });
  const debouncedLoading = useDebounce(isLoading, args.debounce ?? 250);

  return {
    ...rest,
    isLoading: debouncedLoading,
  };
};

export type UseMutationArgs<
  TMutation extends FunctionReference<"mutation", "public">,
> =
  | {
      onError?: (error: Error, variables: TMutation["_args"]) => void;
      onSuccess?: (
        data: TMutation["_returnType"],
        variables: TMutation["_args"],
      ) => void;
      onMutate?: (variables: TMutation["_args"]) => void;
      onSettled?: (
        data: TMutation["_returnType"] | undefined,
        error: Error | null,
        variables: TMutation["_args"],
      ) => void;
    }
  | undefined;

export const useMut = <
  TMutation extends FunctionReference<"mutation", "public">,
>(
  mut: TMutation,
  args?: UseMutationArgs<TMutation>,
) => {
  return useMutation({
    mutationFn: useConvexMutation(mut),
    ...args,
    throwOnError: () => false,
  });
};
