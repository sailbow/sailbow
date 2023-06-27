import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { env } from "~/env.mjs"
import * as schema from './schema';

const pool = new Pool({
    connectionString: env.DB_CONN_STRING
})

export const db = drizzle(pool, { schema })
