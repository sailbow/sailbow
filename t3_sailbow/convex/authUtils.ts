import { type Auth } from "convex/server";
import { SbError } from "./errorUtils";


export const getUser = async (auth: Auth) => {
  const user = await auth.getUserIdentity();
  if (!user) throw new SbError({ code: "UNAUTHENTICATED" });
  return user;
}