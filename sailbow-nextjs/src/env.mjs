import z from "zod"
import { generateErrorMessage } from "zod-error";

const serverEnvSchema = z.object({
    CLERK_SECRET_KEY: z.string().min(1),
    POSTGRES_URL: z.string().min(1),
    DATABASE_HOST: z.string().min(1),
    DATABASE_USERNAME: z.string().min(1),
    DATABASE_PASSWORD: z.string().min(1),
    UNSPLASH_API_KEY: z.string().min(1),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
})

const clientEnvSchema = z.object({
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1).optional().default("/sign-in"),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(1).optional().default("/sign-up"),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().min(1).optional().default("/dock"),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().min(1).optional().default("/dock"),
})

const parsedServerSchema = serverEnvSchema.safeParse({
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    POSTGRES_URL: process.env.POSTGRES_URL,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    UNSPLASH_API_KEY: process.env.UNSPLASH_API_KEY,
    NODE_ENV: process.env.NODE_ENV
})

const parsedClientSchema = clientEnvSchema.safeParse({
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
})

if (!parsedServerSchema.success) {
    console.error(generateErrorMessage(parsedServerSchema.error.issues, {
        delimiter: { error: "\n" },
    }))
}

if (!parsedClientSchema.success) {
    console.error(generateErrorMessage(parsedClientSchema.error.issues, {
        delimiter: { error: "\n" },
    }))
}

if (!parsedServerSchema.success || !parsedClientSchema.success) {
    process.exit(-1)
}

export const serverEnv = parsedServerSchema.data
export const clientEnv = parsedClientSchema.data