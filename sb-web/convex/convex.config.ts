import { defineApp } from "convex/server";
import resend from "@convex-dev/resend/convex.config";
import reactions from "./components/reactions/component/convex.config";

const app = defineApp();
app.use(resend);
app.use(reactions);

export default app;
