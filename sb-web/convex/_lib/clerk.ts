import { createClerkClient, type User } from '@clerk/backend';
import { z } from 'zod';

export const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export function getPrimaryEmail(user: User): string {
  const email = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
  if (!email) throw new Error("Missing primary email address for user");
  return email;
}

export const userSchema = z.object({
  id: z.string().min(1),
  email_addresses: z.array(z.object({
    id: z.string().min(1),
    email_address: z.string().email(),
  })),
  primary_email_address_id: z.string().min(1),
  image_url: z.string().url(),
  first_name: z.string(),
  last_name: z.string(),
});