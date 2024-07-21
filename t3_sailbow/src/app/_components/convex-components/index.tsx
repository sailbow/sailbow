"use client";
import React, { useState } from "react";
import { useConvex, useMutation, useQuery } from "convex/react";
import { FunctionReference } from "convex/server";
import { ConvexError, Value } from "convex/values";
import ConvexErrorBoundary from "./error-boundary";

interface UseConvexQueryResult {
  isLoading: boolean;
  data: unknown;
  error: ConvexError<Value> | null;
}
interface Props {
  children: React.ReactNode;
}
const useConvexQuery = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
};
