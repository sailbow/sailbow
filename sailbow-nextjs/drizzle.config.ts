import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("{USERNAME}:{PASSWORD}")) {
    throw new Error("Invalid DATABASE_URL env parameter")
}

export default {
    schema: "./src/db/schema.ts",
    out: "./src/db/migrations",
    driver: "mysql2",
    strict: true,
    dbCredentials: {
        connectionString: process.env.DATABASE_URL as string
    },
} satisfies Config;