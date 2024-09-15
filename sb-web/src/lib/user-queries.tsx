import { api } from "@convex/_generated/api";
import { useQ } from "./convex-client-helpers";

export const useMe = () => useQ({ query: api.users.queries.me, args: {} });
