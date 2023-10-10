import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

if (!process.env.DATABASE_URL) throw new Error("Missing DATABASE_URL env parameter")

export default {
    schema: "./src/db/schema.ts",
    out: "./src/db/migrations",
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.DATABASE_URL,
    }
} satisfies Config;