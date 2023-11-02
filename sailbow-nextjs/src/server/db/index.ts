import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import * as schema from "./schema";
import { serverEnv } from "@/env.mjs"

const connection = connect({
  host: serverEnv.DATABASE_HOST,
  username: serverEnv.DATABASE_USERNAME,
  password: serverEnv.DATABASE_PASSWORD
})

export { schema }
export const db = drizzle(connection, { schema })