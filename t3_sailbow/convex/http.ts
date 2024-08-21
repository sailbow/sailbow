import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { z } from "zod";
import { api, internal } from "./_generated/api";
import { userSchema } from "./_lib/clerk";
import { Webhook } from "svix";

const clerkWebhookSchema = z.object({
  data: z.any(),
  type: z.string(),
});

type ClerkWebhook = z.infer<typeof clerkWebhookSchema>
// define the webhook handler
const handleClerkWebhook = httpAction(async (ctx, request) => {
  const headers = {
    "svix-id": request.headers.get("svix-id")!,
    "svix-timestamp": request.headers.get("svix-timestamp")!,
    "svix-signature": request.headers.get("svix-signature")!,
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body: ClerkWebhook = await request.json()

  new Webhook(process.env.CLERK_WEBHOOK_SECRET!).verify(JSON.stringify(body), headers);
  const event = clerkWebhookSchema.parse(body);

  switch (event.type) {
    case "user.created":
    case "user.updated":
      await ctx.runMutation(internal.users.mutations.upsertUser, userSchema.parse(event.data));
    default:
      console.log(`Ignored clerk webhook event: ${event.type}`);
  }
  return new Response(null, { status: 200 })
});

// define the http router
const http = httpRouter()

// define the webhook route
http.route({
  path: '/clerk-webhook',
  method: 'POST',
  handler: handleClerkWebhook,
});

export default http;