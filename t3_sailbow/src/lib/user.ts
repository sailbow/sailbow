import { type User } from "@clerk/nextjs/server";

export function GetPrimaryEmail(user: User): string {
  const email = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
  if (!email) throw new Error("Missing primary email address for user");
  return email;
}