import { defineApp } from "convex/server";
import resend from "@convex-dev/resend/convex.config";
import reactions from "./components/reactions/component/convex.config";
import twilio from "@convex-dev/twilio/convex.config.js";

const app = defineApp();
app.use(resend);
app.use(reactions);
app.use(twilio);

export default app;
