// convex/messages.ts
import { twilio } from "../lib/twilio";
import { internalAction } from "../_generated/server";
import { v } from "convex/values";

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER!;
export const sendSms = internalAction({
  args: {
    body: v.string(),
    to: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const status = await twilio.sendMessage(ctx, {
        ...args,
        from: TWILIO_PHONE_NUMBER,
      });
      if (status.error_message) {
        console.error(status.error_message);
      }
    } catch (err) {
      console.error(err);
    }
  },
});
