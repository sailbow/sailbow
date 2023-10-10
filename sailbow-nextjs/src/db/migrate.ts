import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { config } from "dotenv";

if (process.env.NODE_ENV !== 'production') {
    config()
  }

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function main() {
    console.log(__dirname)
    console.log("migration started...");
    await migrate(db, { migrationsFolder: "src/db/migrations" });
    console.log("migration ended...");
    process.exit(0);
}

main().catch((err) => {
    console.log(err);
    process.exit(0);
});