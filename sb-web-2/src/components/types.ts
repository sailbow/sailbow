import { Doc } from "@convex/_generated/dataModel";

export type Poll = Omit<Doc<"polls">, "_creationTime" | "_id"> & {
  options: Omit<Doc<"pollOptions">, "_creationTime" | "pollId">[];
  responses: Omit<Doc<"pollResponses">, "_creationTime" | "_id">[];
};
