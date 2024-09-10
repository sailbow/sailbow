import { internalAction } from "@convex/_generated/server";
import { v } from "convex/values";
import { clerkClient } from "@convex/_lib/clerk";
import { resend } from "@convex/_lib/resend";
import TripInviteTemplate from "@convex/emails/trip-invite";

function getBaseUrl() {
  if (process.env.WEBSITE_BASE_URL) return process.env.WEBSITE_BASE_URL;
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
});

export const sendTripInvite = internalAction({
  args: {
    inviteId: v.id("invitations"),
    email: v.string(),
    invitedByName: v.string(),
    invitedByEmail: v.string(),
    tripName: v.string(),
  },
  handler: async (ctx, args) => {
    await resend.emails.send({
      to: args.email,
      from: 'no-reply@sailbow.app',
      subject: "You've been invited!",
      react: (TripInviteTemplate({
        ...args,
        inviteeEmail: args.email
      })),
    });
  }
});