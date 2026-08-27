import { Resend } from "@convex-dev/resend";
export { render } from "@react-email/components";
import { components } from "../_generated/api";

export const resend: Resend = new Resend(components.resend, {
  apiKey: process.env.RESEND_API_KEY,
  testMode: false,
});
