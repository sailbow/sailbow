"use node";
import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { clerkClient } from "../lib/clerk"
import { resend } from "../lib/resend";
import TripInviteTemplate from "../emails/tripInvite";

// export const sendEmailInvite = internalAction({
//   args: {
//     inviteId: v.id("invitations"),
//     email: v.string(),
//   },
//   handler: async (ctx, args) => {
//     return await clerkClient.invitations.createInvitation({
//       emailAddress: args.email,
//       redirectUrl: `${getBaseUrl()}/accept-invite/${args.inviteId}`,
//       ignoreExisting: true,
//     });
//   }
// });

export const sendTripInvite = internalAction({
  args: {
    inviteId: v.id("invitations"),
    email: v.string(),
    invitedByName: v.string(),
    invitedByEmail: v.string(),
    tripName: v.string(),
  },
  handler: async (ctx, args) => {
    const response = await resend.emails.send({
      to: args.email,
      from: 'no-reply@sailbow.app',
      subject: "You've been invited!",
      react: TripInviteTemplate({
        ...args,
        inviteeEmail: args.email
      }),
    });
    console.log(response);
  }
});