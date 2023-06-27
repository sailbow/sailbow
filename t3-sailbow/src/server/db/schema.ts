import { InferModel, relations } from "drizzle-orm"
import { pgTable, serial, text, varchar, timestamp, uniqueIndex, integer, primaryKey } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 256 }).notNull(),
    phone: text("phone"),
    name: varchar("name", { length: 50 }),
    role: text("role", { enum: [ "user", "agent", "admin" ]}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
}, (users) => {
    return {
        emailIndex: uniqueIndex("email_idx").on(users.email),
        phoneIndex: uniqueIndex("phone_idx").on(users.phone)
    }
})

export type User = InferModel<typeof users>
export type InsertUser = InferModel<typeof users, "insert">

export const userRelations = relations(users, ({ many }) => ({
    connectedAccounts: many(connectedAccounts)
}))

export const connectedAccounts = pgTable("connected_accounts", {
    userId: integer("user_id").notNull().references(() => users.id),
    provider: text("provider").notNull(),
    providerUserId: text("provider_user_id")
}, (connectedAccounts) => {
    return {
        pk: primaryKey(connectedAccounts.userId, connectedAccounts.provider)
    }
})

export type InsertConnectedAccount = InferModel<typeof connectedAccounts, "insert">