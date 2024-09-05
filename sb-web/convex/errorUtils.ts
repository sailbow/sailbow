import { ConvexError } from "convex/values";

type ErrorBase = { message?: string | null | undefined };
type UnauthenticatedError  = { code: "UNAUTHENTICATED" };
type NotFoundError = { code: "NOT_FOUND" }
type UserError = { code: "USER_ERROR", message: string };

export type SbErrorContent = ErrorBase & (
  | UnauthenticatedError
  | NotFoundError
  | UserError
)
export class SbError extends ConvexError<SbErrorContent> {
  constructor (data: SbErrorContent) {
    super(data);
  }
}