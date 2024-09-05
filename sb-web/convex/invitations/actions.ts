import { internalAction } from "@convex/_generated/server";
import { v } from "convex/values";
import { clerkClient } from "@convex/_lib/clerk";

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const sendEmailInvite = internalAction({
  args: {
    inviteId: v.id("invitations"),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await clerkClient.invitations.createInvitation({
      emailAddress: args.email,
      redirectUrl: `${getBaseUrl()}/accept-invite/${args.inviteId}`,
      ignoreExisting: true,
    });
  }
})