import { z } from 'zod';

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