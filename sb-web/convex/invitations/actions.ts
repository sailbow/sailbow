"use node";
import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { resend, render } from "../lib/resend";
import TripInviteTemplate from "../emails/tripInvite";

export const sendTripInvite = internalAction({
  args: {
    inviteId: v.id("invitations"),
    email: v.string(),
    invitedByName: v.string(),
    invitedByEmail: v.string(),
    tripName: v.string(),
  },
  handler: async (ctx, args) => {
    const emailId = await resend.sendEmail(
      ctx,
      "no-reply@sailbow.app",
      args.email,
      "You've been invited!",
      await render(TripInviteTemplate({ ...args, inviteeEmail: args.email })),
    );
    console.log(`Sent trip invitation email: ${emailId}`);
  },
});
